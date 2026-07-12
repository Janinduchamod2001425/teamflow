import { api } from "./api";

export const InvitationService = {
  findMine() {
    return api.get("/invitations/me");
  },

  respond(invitationId: string, status: "ACCEPTED" | "DECLINED") {
    return api.patch(`/invitations/${invitationId}/respond`, { status });
  },
};
