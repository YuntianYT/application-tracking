import React, { useEffect, useState } from 'react';
import PieChart from '../components/PieChart';
import { doc, getDoc, onSnapshot } from '@firebase/firestore';
import { useUser, useFirestore } from 'reactfire';
import LineChart from '../components/LineChart';

function Insight() {
  const [data, setData] = useState([]);
  const { data: user } = useUser();
  const db = useFirestore();
  const docRef = doc(db, 'user', user.email);
  useEffect(() => {
    const fetchData = async () => {
      const docSnap = await getDoc(docRef);
      const applications = docSnap.data()?.applications;
      applications?.forEach((application, index) => {
        application.num = index + 1;
      });
      setData(applications);
    };
    const unsubscribe = onSnapshot(docRef, fetchData);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <PieChart data={data} />
      <LineChart data={data} />
    </div>
  );
}

export default Insight;
