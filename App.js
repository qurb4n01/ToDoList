import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [textColor, setTextColor] = useState([]);

  const saveTasks = async (tasks) => {
    await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('@tasks');
      if (savedTasks !== null) {
        return JSON.parse(savedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
    return [];
  };

  useEffect(() => {
    const loadTasksAsync = async () => {
      const savedTasks = await loadTasks();
      setTasks(savedTasks);
    };
    loadTasksAsync();
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleAddTask = () => {
    if (taskInput.trim() !== '') {
      setTasks([...tasks, taskInput]);
      setTaskInput('');
      setTextColor([...textColor, 'black']);
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    const updatedTextColor = [...textColor];
    updatedTextColor.splice(index, 1);
    setTextColor(updatedTextColor);
  };

  const handleEditTask = (index, editedTask) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = editedTask;
    setTasks(updatedTasks);
  };

  const ChangeColor = (index) => {
    const updatedTextColor = [...textColor];
    updatedTextColor[index] = '#b6b6b6';
    setTextColor(updatedTextColor);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Görüləcək İşlər Siyahısı</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={styles.textInput}
          placeholder='Yeni tapşırıq əlavə edin'
          value={taskInput}
          onChangeText={setTaskInput}
        />
        <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
          <Text>Əlavə et</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.tasksLabel}>Tapşırıqlar:</Text>

      <ScrollView style={styles.tasksContainer}>
        {tasks.map((task, index) => (
          <View key={index} style={styles.taskItem}>
            <TextInput onChangeText={(task) => { handleEditTask(index, task) }} style={[styles.taskText, { color: textColor[index] }]} value={task} />
            <View style={styles.taskButtons}>
              <TouchableOpacity onPress={() => { ChangeColor(index) }} style={styles.button}>
                <Image source={require('./assets/basic-tick.png')} style={styles.buttonImage} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleDeleteTask(index)}>
                <Image source={require('./assets/close.png')} style={styles.buttonImage} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 50,
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 1,
  },
  tasksLabel: {
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
  },
  tasksContainer: {
    width: '100%',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  taskText: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginRight: 1,
  },
  taskButtons: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 10,
  },
  buttonImage: {
    width: 20,
    height: 20,
  },
  addButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default App;
