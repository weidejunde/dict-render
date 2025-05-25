const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

const dictionary = {
  apple: {
    definition: "A fruit that grows on trees, usually red, green, or yellow.",
    example: "I ate an apple for breakfast.",
  },
  banana: {
    definition: "A long curved fruit that grows in clusters and has soft pulpy flesh.",
    example: "Monkeys love bananas.",
  },
};

// Middleware để parse JSON nếu cần (để mở rộng)
app.use(express.json());

// Serve file tĩnh (nếu có)
app.use(express.static(path.join(__dirname, 'public')));

// API từ điển
app.get('/api/define/:word', (req, res) => {
  const word = req.params.word.toLowerCase();
  if (dictionary[word]) {
    res.json({ word, ...dictionary[word] });
  } else {
    res.status(404).json({ error: "Word not found" });
  }
});

// Trang chính có giao diện tìm kiếm
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Dictionary App</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          input { padding: 8px; font-size: 16px; }
          button { padding: 8px 12px; font-size: 16px; }
          .result { margin-top: 20px; }
          .error { color: red; }
        </style>
      </head>
      <body>
        <h1>Simple Dictionary</h1>
        <input id="wordInput" type="text" placeholder="Enter a word" />
        <button onclick="search()">Search</button>
        <div class="result" id="result"></div>

        <script>
          async function search() {
            const word = document.getElementById('wordInput').value.trim();
            const resultDiv = document.getElementById('result');
            if (!word) {
              resultDiv.innerHTML = '<p class="error">Please enter a word.</p>';
              return;
            }
            try {
              const res = await fetch('/api/define/' + encodeURIComponent(word));
              if (!res.ok) throw new Error('Word not found');
              const data = await res.json();
              resultDiv.innerHTML = '<h3>' + data.word + '</h3>'
                + '<p><strong>Definition:</strong> ' + data.definition + '</p>'
                + '<p><em>Example:</em> ' + data.example + '</p>';
            } catch (err) {
              resultDiv.innerHTML = '<p class="error">' + err.message + '</p>';
            }
          }
        </script>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
