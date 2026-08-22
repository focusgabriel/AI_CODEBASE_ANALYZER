import { BrevoClient, Brevo } from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY;
console.log(apiKey)


if (!apiKey) {
  throw new Error("Missing BREVO_API_KEY environment variable");
}

const brevoClient = new BrevoClient({
  apiKey,
});

const apiInstance: {
  sendTransacEmail: (
    request: Brevo.SendTransacEmailRequest
  ) => Promise<Brevo.SendTransacEmailResponse>;
} = {
  sendTransacEmail: (request) =>
    brevoClient.transactionalEmails.sendTransacEmail(request),
};

export default apiInstance;