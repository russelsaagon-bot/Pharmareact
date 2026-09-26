import QRCode from "qrcode";


export async function genererQRCode(data){


const qr = await QRCode.toDataURL(
JSON.stringify(data)
);


return qr;


}