import { wsGateway as realWs } from './ws.js';

export type WsPort = {
  notifyUser: (args: {
    userId: number;
    type: 'NEW_COMMENT' | 'PRICE_CHANGE' | string;
    message: string;
    createdAt?: Date;
    data?: Record<string, unknown>;
  }) => void;
};

const defaultPorts = { ws: realWs as WsPort };

export const ports: { ws: WsPort } = { ...defaultPorts };

export function setPorts(patch: Partial<typeof ports>) {
  Object.assign(ports, patch);
}

export function resetPorts() {
  ports.ws = defaultPorts.ws;
}
