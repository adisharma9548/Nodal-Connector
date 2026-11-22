export default function handler(req: any, res: any) {
  res.status(200).json({ status: 'ok', message: 'Test serverless function is working!', time: new Date().toISOString() });
}
