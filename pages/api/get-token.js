import { getToken } from "next-auth/jwt"

const secret = process.env.NEXTAUTH_SECRET

export default async (req, res) => {
  const token = await getToken({ req, secret })
  if (token) {
    res.status(200).send(token)
  } else {
    res.status(401)
  }
  res.status(401).end('error')
}