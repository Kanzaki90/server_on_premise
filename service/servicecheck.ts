import express from "express";
// export const servicecheck = (req: express.Request, res: express.Response) => {
//     res.status(200).json({health: 'Alive'})
// }

export default function  servicecheck  (
    req: express.Request,
    res: express.Response)  {
    res.status(200).json({health: 'Alive'})
}

