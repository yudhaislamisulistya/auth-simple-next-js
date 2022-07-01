import { MongoClient, ObjectId } from "mongodb";

export default async function handler(req, res){
    if(req.method !== "GET"){
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const { _id } = req.query


    if(!_id || _id.length < 24){
        return res.status(400).json({
            status: "error",
            code: 400,
            error: "Bad Request"
        });
    }

    const client = await MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db()

    const user = await db.collection("users").findOne({ _id: ObjectId(_id) })

    if(!user){
        return res.status(400).json({
            status: "error",
            code: 400,
            error: "Bad Request => User not found"
        });
    }

    return res.status(200).json({
        status: "success",
        data: user
    })
}