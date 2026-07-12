-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "WorkspaceMember" ADD COLUMN     "status" "MembershipStatus" NOT NULL DEFAULT 'ACCEPTED';
