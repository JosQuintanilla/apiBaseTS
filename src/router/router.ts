import { Router, Request, Response } from 'express';
import { postTransporte } from "../lambda/post-transporte";
import { putTransporte } from "../lambda/put-transporte";
import { putTransportePalletMixto } from "../lambda/put-transporte-palletmixto";
import { recepcionTransporte } from "../lambda/recepcion-transporte"
import { cambioFecha } from "../lambda/cambioFecha";

const router = Router();

router.get('/recepcionTransporte', async (req: Request, res: Response) =>{
    res.json(await recepcionTransporte());
});

router.get('/postTransporte', async (req: Request, res: Response) =>{
    res.json(await postTransporte());
});

router.get('/putTransporte', async (req: Request, res: Response) =>{
    res.json(await putTransporte());
});

router.get('/putTransportePalletMixto', async (req: Request, res: Response) =>{
    res.json(await putTransportePalletMixto());
});

router.get('/cambioFecha', async (req: Request, res: Response) =>{
    res.json(await cambioFecha());
});


 export default router;