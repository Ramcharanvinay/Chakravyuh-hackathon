// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This Supabase Edge Function securely writes submission records to Google Sheets
// using Google Service Account credentials stored in environment variables.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SyncPayload {
  submissionId: string;
  teamId: string;
}

// Generate Google Service Account OAuth2 Bearer Token
async function getGoogleAuthToken(serviceAccountEmail: string, privateKeyPem: string): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: serviceAccountEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  function base64UrlEncode(str: string): string {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaim = base64UrlEncode(JSON.stringify(claim));
  const message = `${encodedHeader}.${encodedClaim}`;

  // Clean and import RSA Private Key
  const cleanPem = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  
  const binaryDer = Uint8Array.from(atob(cleanPem), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const encoder = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    encoder.encode(message)
  );

  const signatureBase64 = base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signatureBuffer))
  );
  const jwt = `${message}.${signatureBase64}`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();
    throw new Error(`Google Auth Token request failed: ${errorBody}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const googleClientEmail = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const googlePrivateKey = Deno.env.get("GOOGLE_PRIVATE_KEY");
    const spreadsheetId = Deno.env.get("GOOGLE_SPREADSHEET_ID");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase server credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body: SyncPayload = await req.json();

    if (!body.submissionId || !body.teamId) {
      return new Response(
        JSON.stringify({ error: "Missing submissionId or teamId in request" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch complete submission + team + selection + track + problem metadata
    const { data: submission, error: subError } = await supabase
      .from("submissions")
      .select(`
        id,
        team_id,
        github_repo_url,
        ppt_file_name,
        ppt_storage_path,
        ppt_size_bytes,
        submitted_at,
        spreadsheet_sync_status,
        teams (
          id,
          team_name,
          leader_email
        )
      `)
      .eq("id", body.submissionId)
      .single();

    if (subError || !submission) {
      throw new Error(`Submission not found: ${subError?.message || "Unknown error"}`);
    }

    const { data: selection } = await supabase
      .from("team_selections")
      .select(`
        track_id,
        problem_statement_id,
        tracks ( name ),
        problem_statements ( problem_code, title )
      `)
      .eq("team_id", submission.team_id)
      .single();

    // Check if Google credentials are configured
    if (!googleClientEmail || !googlePrivateKey || !spreadsheetId) {
      await supabase
        .from("submissions")
        .update({
          spreadsheet_sync_status: "not_configured",
          sync_error: "Google Sheets credentials (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID) are not configured in Supabase Edge Secrets.",
        })
        .eq("id", submission.id);

      return new Response(
        JSON.stringify({
          status: "not_configured",
          message: "Google Sheets credentials not set in Supabase Secrets. Marked as 'not_configured'.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Obtain Google Access Token
    const accessToken = await getGoogleAuthToken(googleClientEmail, googlePrivateKey);

    // 3. Prevent duplicate rows: Check existing rows in spreadsheet
    const range = "Submissions!A:B";
    const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
    const checkRes = await fetch(checkUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let rowExists = false;
    if (checkRes.ok) {
      const existingData = await checkRes.json();
      const rows = existingData.values || [];
      // Look for matching team_id in column B (index 1)
      rowExists = rows.some((r: string[]) => r[1] === submission.team_id);
    }

    const teamData = Array.isArray(submission.teams) ? submission.teams[0] : submission.teams;
    const trackName = (selection?.tracks as any)?.name || selection?.track_id || "N/A";
    const problemTitle = (selection?.problem_statements as any)?.title 
      ? `[${(selection?.problem_statements as any)?.problem_code}] ${(selection?.problem_statements as any)?.title}`
      : selection?.problem_statement_id || "N/A";

    const rowValues = [
      teamData?.team_name || "Unknown Team",
      submission.team_id,
      trackName,
      selection?.problem_statement_id || "N/A",
      problemTitle,
      submission.github_repo_url,
      submission.ppt_file_name,
      submission.ppt_storage_path,
      submission.ppt_size_bytes,
      submission.submitted_at,
      "synced",
    ];

    if (!rowExists) {
      // Append row
      const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Submissions!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
      const appendRes = await fetch(appendUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: [rowValues] }),
      });

      if (!appendRes.ok) {
        const errorText = await appendRes.text();
        throw new Error(`Failed to append row to Google Sheets: ${errorText}`);
      }
    }

    // 4. Update Supabase record status
    await supabase
      .from("submissions")
      .update({
        spreadsheet_sync_status: "synced",
        spreadsheet_synced_at: new Date().toISOString(),
        sync_error: null,
      })
      .eq("id", submission.id);

    return new Response(
      JSON.stringify({
        status: "synced",
        message: "Submission row successfully synchronized with Google Sheets.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Sheets sync error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Unknown internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
