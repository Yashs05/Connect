import axios from "axios";

const fetchLocations = async (searchTerm, setLocationList, setDisplay) => {

  const options = {
    method: 'GET',
    url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
    params: { namePrefix: searchTerm, sort: '-population', limit: '10' },
    headers: {
      'X-RapidAPI-Key': '623e2f09fbmshc927d63ce7cfd75p11948bjsn8147e234ff25',
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options)
    const data = await response.data.data

    setLocationList(data)

    if (data.length) {
      setDisplay(true)
    }
    else {
      setDisplay(false)
    }

  }
  catch (err) {
    console.log(err.message)
  }
}

export default fetchLocations