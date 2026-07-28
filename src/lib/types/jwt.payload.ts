import type { JwtPayload } from "jsonwebtoken";

export type JwtSessionPayload = {
  username: string;
} & JwtPayload;