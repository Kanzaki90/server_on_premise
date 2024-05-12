import express from "express";

export default function  home  (
    req: express.Request,
    res: express.Response)  {
    res.status(200).json({health: 'You are at /'})
}