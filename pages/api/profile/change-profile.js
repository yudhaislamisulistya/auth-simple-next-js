import { MongoClient, ObjectId } from "mongodb";


export default async function handler(req, res){
    if(req.method !== "PUT"){
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const { _id, name, nohp } = req.body

    if(!_id || !name || !nohp){
        return res.status(400).json({
            error: "Bad Request"
        });
    }

    const client = await MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db()

    const user = await db.collection("users").findOne({ _id: ObjectId(_id) })

    if(user){
        if(user.name == name && user.nohp == nohp){
            return res.status(400).json({
                status: "error",
                error: "Accepted, But Profile not Changed (Reason => Same Status)",
                code: 202,
                data: {
                    _id, name, nohp
                }
            })
        }else{
            const result = await db.collection("users").updateOne({ _id: ObjectId(_id) }, { $set: { name: name, nohp: nohp } })
            return res.status(200).json({
                status: "success",
                success: "Process Complete, Data Has Been Changed",
                code: 200,
                dataBefore: {
                    _id: user._id,
                    name: user.name,
                    nohp: user.nohp
                },
                dataAfter: {
                    _id, name, nohp
                },
                result: result
            })
        }
    }else{
        return res.status(400).json({
            status: "error",
            error: "Bad Request => User not found",
            code: 400,
            data: {
                _id, name, nohp
            }
        })
    }
}
