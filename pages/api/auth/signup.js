import { MongoClient } from 'mongodb';
import { hashPassword } from '../../../lib/auth';

async function handler(req, res) {

  const data = req.body;

  const { email, password, name, username, nohp } = data;

  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 7 ||
    !nohp ||
    !username ||
    !name
  ) {
    res.status(422).json({
      code: 422,
      status: 'bad request',
      message:
        'Invalid input - password should also be at least 7 characters long.',
    });
    return;
  }

  const client = await MongoClient.connect(process.env.MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  const db = client.db();

  const existingUser = await db.collection('users').findOne({ email: email, username: username });

  if (existingUser) {
    res.status(422).json({ 
      code: 422,
      status: 'bad request',
      message: 'User exists already!' 
    });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  const result = await db.collection('users').insertOne({
    email: email,
    password: hashedPassword,
    username: username,
    name: name,
    nohp: nohp,
    role: "customer"
  });

  res.status(201).json({ 
    code: 201,
    status: 'created',
    message: 'Created user!' 
  });
  client.close();
}

export default handler;