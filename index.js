const express = require("express");
const cors = require("cors");
const morgan = require('morgan');

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true,
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false,
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true,
    },
];

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(cors());
app.use(express.static('dist'))
app.use(morgan('tiny'));

app.get("/", (request, response) => {
    response.send("<h1>Cześć, jak się czujesz?</h1>");
});

app.get("/api/notes", (request, response) => {
    const contentType = request.get('content-type')
    console.log(contentType)

    // const headers = request.headers
    // console.log(headers)
    response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
    const noteId = request.params.id;
    const note = notes.find((note) => note.id === noteId);

    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/notes/:id", (request, response) => {
    const noteId = request.params.id;
    notes = notes.filter((note) => note.id !== noteId);

    response.send(204).end();
})

const generateId = () => {
    const maxId = notes.reduce( (max, note) => Math.max(max, Number(note.id)), 0);
    return String(maxId + 1);
}

app.post("/api/notes", (request, response) => {

    const body = request.body;

    if (!body.content){
        return response.status(400).json(
            {error: "no content"}
        )
    }
    
    const note = {
        id: generateId(),
        content: body.content,
        important: body.important || false
    }

    notes = notes.concat(note);
    response.json(note)
})

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});
