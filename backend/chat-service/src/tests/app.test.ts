import { describe, expect, test, beforeEach, afterEach, afterAll } from "@jest/globals";
import { io as Client, Socket } from 'socket.io-client';
import { server } from '../app';

describe("App Tests", () => {
  let clientSocket1: Socket;
  let clientSocket2: Socket;
  let serverPort: number;

  beforeAll(done => {
    // Check if the server is listening and get its address
    const address = server.listening && server.address();
    if (address) {
      serverPort = typeof address === 'string' ? parseInt(address.split(':')[1]) : address.port;
      done();
    } else {
      // Handle the case where the server is not listening or address is null
      console.error('Server is not listening or address could not be retrieved.');
      done.fail('Failed to retrieve server port.');
    }
  });

  beforeEach(() => {
    clientSocket1 = Client(`http://localhost:${serverPort}`);
    clientSocket2 = Client(`http://localhost:${serverPort}`);
  });

  afterEach(() => {
    if (clientSocket1) {
      clientSocket1.disconnect();
    }
    if (clientSocket2) {
      clientSocket2.disconnect();
    }
  });

  afterAll(() => {
    server.close();
  });

  // Test 1: Sending and receiving messages between two connected clients
  test("Clients should send and receive messages", async () => {
    jest.setTimeout(10000);

    // Join both clients to the same room
    await new Promise<void>(resolve => {
      let joinCount = 0;
      const checkBothJoined = () => { if (++joinCount === 2) resolve(); };

      clientSocket1.on('connect', () => {
        clientSocket1.emit('join_room', 'test-room2');
        checkBothJoined();
      });
      clientSocket2.on('connect', () => {
        clientSocket2.emit('join_room', 'test-room2');
        checkBothJoined();
      });
    });

    const messageToSend = "Hello, World!";
    
    await new Promise<void>((resolve) => {
      // Client 2 listens for a message
      clientSocket2.on('receive_message', (message) => {
        expect(message.message).toEqual(messageToSend);
        resolve();
      });

      // Client 1 sends a message
      clientSocket1.emit('send_message', {
        room: 'test-room2', 
        message: messageToSend
      });
    });
  }, 10000);
});
