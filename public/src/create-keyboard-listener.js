export default function createKeyboardListener(document, socket) {
    const observers = [];

    function subscribe(method) {
        observers.push(method);
    }

    function notifyAll(command) {
        for (const method of observers) {
            method(command);
        }
    }

    document.addEventListener('keydown', handleKeydown);

    function  handleKeydown(event) {
        const command = {
            type: 'handle-keydown',
            handler: event.key,
            player: { id: socket.id }
        }

        notifyAll(command);
    }

    return {
        subscribe
    }
}