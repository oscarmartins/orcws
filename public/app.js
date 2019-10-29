(function() {
    const messages = document.querySelector('#messages'),
    wsButton = document.querySelector('#wsButton'),
    wsSendButton = document.querySelector('#wsSendButton'),
    logout = document.querySelector('#logout'),
    login = document.querySelector('#login');
  
    function showMessage(message) {
      messages.textContent += `\n${message}`;
      messages.scrollTop = messages.scrollHeight;
    }
  
    function handleResponse(response) {
      return response.ok
        ? response.json().then((data) => JSON.stringify(data, null, 2))
        : Promise.reject(new Error('Unexpected response'));
    }
  
    login.onclick = function() {
      fetch('/login', { method: 'POST', credentials: 'same-origin' })
        .then(handleResponse)
        .then(showMessage)
        .catch(function(err) {
          showMessage(err.message);
        });
    };
  
    logout.onclick = function() {
      fetch('/logout', { method: 'DELETE', credentials: 'same-origin' })
        .then(handleResponse)
        .then(showMessage)
        .catch(function(err) {
          showMessage(err.message);
        });
    };
  
    let ws;
  
    wsButton.onclick = function() {
      if (ws) {
        ws.onerror = ws.onopen = ws.onmessage = ws.onclose = null;
        ws.close();
      }
      
      ws = new WebSocket(`ws://${location.host}`);
      ws.onerror = function() {
        showMessage('WebSocket error');
      };
      ws.onopen = function() {
        showMessage('WebSocket connection established');
      };
      ws.onclose = function() {
        showMessage('WebSocket connection closed');
        ws = null;
      };
      ws.onmessage = function(event) {
        debugger;
        const data = event.data;
        /**
        var resp = 'rss: ' + data.rss + '\n';
        resp += 'heapTotal: ' + data.heapTotal + '\n';
        resp += 'heapUsed: ' + data.heapUsed + '\n';
        resp += 'external: ' + data.external + '\n';
        */
        showMessage(data);

      };
    };
  
    wsSendButton.onclick = function() {
      if (!ws) {
        showMessage('No WebSocket connection');
        return;
      }
  
      ws.send('Hello World!');
      //showMessage('Sent "Hello World!"');
    };
  })();