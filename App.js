import React, { useState, useEffect } from 'react';
import { View, Button, Text, FlatList } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Appbar, List } from 'react-native-paper'; // Thêm import List từ react-native-paper
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyApOEe-hRjt7nXNXZhPzZTopK2ljXbTEP0',
  authDomain: 'project-21ab2.firebaseapp.com',
  projectId: 'project-21ab2',
  storageBucket: 'project-21ab2.appspot.com',
  messagingSenderId: '413895444741',
  appId: '1:413895444741:web:ba4e3c3b2e42c56c864f6c',
  measurementId: 'G-V2EZPSFTZS',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

const App = () => {
  const [text, setText] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const todoCollection = collection(firestore, 'todos');
      const unsubscribe = onSnapshot(todoCollection, (querySnapshot) => {
        const dataArray = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data(); 
          dataArray.push({ id: doc.id, ...data }); 
        });
        setData(dataArray);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchData();

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddData = async () => {
    if (text) {
      const todoCollection = collection(firestore, 'todos');
      await addDoc(todoCollection, { text, complete: true }); 
      setText('');
    }
  };

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: '#00FFFF' }}>
          <Appbar.Content title={'TODOs List'} color='white' />
        </Appbar.Header>
        <FlatList
          style={{ flex: 1 }}
          data={data}
          renderItem={({ item }) => (
            <List.Item
              title={item.text}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={item.complete ? 'check' : 'cancel'}
                />
              )}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        <TextInput
          placeholder={'New Todo'}
          value={text}
          onChangeText={(text) => setText(text)}
        />
        <Button title="Add TODO" onPress={handleAddData} />
      </View>
    </SafeAreaProvider>
  );
};

export default App;
