import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import app from '@/app/firebase';
import "tailwindcss/tailwind.css";

interface SearchResult {
  id: string;
  name: string;
}

interface Car {
  id:string;
  Name: string;
  Capacity: string;
  Mileage:string;
  Timer:string;
}

const Autocomplete: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formData, setFormData] = useState<Car>({
    id:"",
    Name: "",
    Capacity: "",
    Mileage:"",
    Timer:""
  });
  const [carList, setCarList] = useState<Car[]>([]);
  const [carDetails, setCarDetails] = useState<Car | null>(null);

  const handleFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const addCarData = async () => {
    try {
      const db = getFirestore(app);
      const carCollectionRef = collection(db, 'Cars');
      
     
      const { id, ...carData } = formData;

      await setDoc(doc(carCollectionRef, formData.Name), carData);

    } catch (error) {
      console.error('Error adding car data:', error);
    }
  }

  useEffect(() => {
    const fetchCarList = async () => {
      try {
        const db = getFirestore(app);
        const carCollectionRef = collection(db, 'Cars');
        const querySnapshot = await getDocs(carCollectionRef);

        const cars: Car[] = [];
        querySnapshot.forEach(doc => {
          const carData = doc.data() as Car;
          const carWithId = { ...carData, id: doc.id };
          cars.push(carWithId);
        });
        setCarList(cars);
      } catch (error) {
        console.error('Error fetching car list:', error);
      }
    };

    fetchCarList();
  }, []);




  return (
    <div className='border flex flex-col gap-lg-5 border-2 lg:w-1/2 align-self-lg-center ml-32'>
      <input
        type="text"
        value={formData.Name}
        className='w-full'
        onChange={handleFormData}
        name="Name"
        placeholder="Car name"
      />
      <input
        type="text"
        value={formData.Capacity}
        className='w-full'
        onChange={handleFormData}
        name="Capacity"
        placeholder="Car capacity"
      />
       <input
        type="text"
        value={formData.Mileage}
        className='w-full'
        onChange={handleFormData}
        name="Mileage"
        placeholder="Car Mileage"
      />
        <input
        type="text"
        value={formData.Timer}
        className='w-full'
        onChange={handleFormData}
        name="Timer"
        placeholder="Car Mileage"
      />
      <button onClick={addCarData}>Add Car</button>

      <h2>Car List</h2>
      <ul>
        {carList.map((car, index) => (
          <li key={index}>
          
            <p>Name: {car.id}</p>
            <p>Mileage:{car.Mileage}</p>
            <p>Capacity: {car.Capacity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;