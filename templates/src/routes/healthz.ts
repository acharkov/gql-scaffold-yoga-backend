import { HttpResponse, HttpRequest } from 'uWebSockets.js'


export function handleHealthz(res: HttpResponse, _req: HttpRequest) {
	res.cork(() => {
		res.writeStatus('200 OK').writeHeader('Content-Type', 'application/json').end('{"ok":true}')
	})
}
