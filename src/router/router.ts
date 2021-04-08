import { Router, Request, Response } from 'express';
import { getTask } from "../services/post-transporte";

const router = Router();


router.get('/prueba', async (req: Request, res: Response) =>{

    res.json(await getTask());
 });


 export default router;