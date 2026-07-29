import QRCode from 'qrcode';

export async function generateQRCodeDataURI(url: string): Promise<string> {
  try {
    const dataURI = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 400,
      color: {
        dark: '#FF4F00', // Using our brand accent primary
        light: '#ffffff'
      }
    });
    return dataURI;
  } catch (err) {
    throw new Error('Failed to generate QR code');
  }
}
