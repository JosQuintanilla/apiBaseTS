import { Router, Request, Response } from 'express';
import { postTransporte } from "../lambda/post-transporte";
import { putTransporte } from "../lambda/put-transporte";
import { putTransportePalletMixto } from "../lambda/put-transporte-palletmixto";

import { miLambda } from "../lambda/milambda";

const router = Router();


router.get('/postTransporte', async (req: Request, res: Response) =>{

    res.json(await postTransporte());
});

router.get('/putTransporte', async (req: Request, res: Response) =>{

    res.json(await putTransporte());
});

router.get('/putTransportePalletMixto', async (req: Request, res: Response) =>{

    res.json(await putTransportePalletMixto());
});

router.get('/miLambda', async (req: Request, res: Response) =>{

    res.json(await miLambda());
});


 export default router;