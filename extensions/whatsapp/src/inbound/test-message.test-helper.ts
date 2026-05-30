import { withDeprecatedWebInboundMessageFlatAliases } from "./message-aliases.js";
import type { WhatsAppSendResult } from "./send-result.js";
import type {
  WebInboundCallbackMessage,
  WebInboundMessage,
  WhatsAppInboundEvent,
  WhatsAppInboundPayload,
  WhatsAppInboundPlatform,
} from "./types.js";

type TestInboundMessageOverrides = Partial<
  Omit<WebInboundCallbackMessage, "event" | "payload" | "platform">
> & {
  event?: Partial<WhatsAppInboundEvent>;
  payload?: Partial<WhatsAppInboundPayload>;
  platform?: Partial<WhatsAppInboundPlatform>;
};

function acceptedSendResult(kind: "media" | "text", id: string): WhatsAppSendResult {
  return {
    kind,
    messageId: id,
    keys: [{ id }],
    providerAccepted: true,
  };
}

export function createTestWebInboundMessage(
  overrides: TestInboundMessageOverrides = {},
): WebInboundMessage {
  const { event, payload, platform, ...message } = overrides;
  return withDeprecatedWebInboundMessageFlatAliases({
    event: {
      id: "msg-1",
      ...event,
    },
    payload: {
      body: "hello",
      ...payload,
    },
    platform: {
      chatJid: "+15551234567",
      recipientJid: "+15559876543",
      sendComposing: async () => {},
      reply: async () => acceptedSendResult("text", "reply-1"),
      sendMedia: async () => acceptedSendResult("media", "media-1"),
      ...platform,
    },
    from: "+15551234567",
    conversationId: "+15551234567",
    accountId: "default",
    chatType: "direct",
    ...message,
  });
}
