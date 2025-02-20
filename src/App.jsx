import logo from './logo.svg';
import './App.css';
import {Row,Col,Card} from 'react-bootstrap';
import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  const [fishes,setFishes] = useState([]);
  const [newFish, setNewFish] = useState({
    nev: '',
    faj: '',
    meretCm: '',
    toId: '',
    kep: ''
});

  useEffect(() => {
    axios.get('https://localhost:7067/api/Halak')
    .then(response => {
      setFishes(response.data);
    })
    .catch(error => {
      console.error('Hiba történt az adatok lekérésekor:',error);
    })
  })

  const Torles = (id) => {
    axios.delete(`https://localhost:7067/api/Halak/${id}`)
    .then(() => {
      setFishes(fishes.filter(fish => fish.id !== id));
    })
    .catch(error => {
      console.error('Hiba történt a törlés során:',error);
    })
  }

  const HalHozzaadasa = (e) => {
    e.preventDefault();
    axios.post('https://localhost:7067/api/Halak', newFish)
        .then(response => {
            setFishes([...fishes, response.data]); // Új játékos hozzáadása a listához
            setNewFish({ nev: '', faj: '', meretCm: '', toId: '' , kep: '' }); // Mezők törlése
        })
        .catch(error => {
            console.error('Hiba történt a hozzáadáskor:', error);
        });
  };

  const handleInputChange = (e) => {
    setNewFish({ ...newFish, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Új hal hozzáadása</h2>
      <form onSubmit={HalHozzaadasa}>
          <input type="text" name="nev" placeholder="Név" value={newFish.nev} onChange={handleInputChange} required />
          <input type="date" name="faj" value={newFish.faj} onChange={handleInputChange} required />
          <input type="number" name="meretCm" placeholder="Méret (cm)" value={newFish.meretCm} onChange={handleInputChange} required />
          <input type="text" name="toId" placeholder="Tó Id" value={newFish.toId} onChange={handleInputChange} required />
          <input type="text" name="kep" placeholder="Kép URL" value={newFish.kep} onChange={handleInputChange} required />
          <button type="submit">Hozzáadás</button>
      </form>
      <Row>
        {fishes.map(fish => (
          <Col key={fish.id}>
            <Card>
              <Card.Img src={fish.kep.startsWith("http")
                      ? fish.kep
                      : `data:image/jpeg;base64,${fish.kep}`}></Card.Img>
              <Card.Body>
                <Card.Title><strong>{fish.nev}</strong></Card.Title>
                <Card.Text>Faj:{fish.faj}</Card.Text>
                <Card.Text>Méret(cm):{fish.meretCm}</Card.Text>
                <Card.Text>Tó Id:{fish.toId}</Card.Text>
                <button onClick={() => Torles(fish.id)}>Törlés</button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default App;
