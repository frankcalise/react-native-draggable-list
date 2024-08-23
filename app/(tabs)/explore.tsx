import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import DraggableFlatList, { OpacityDecorator, RenderItemParams, ScaleDecorator, ShadowDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const TASKS = Array.from({ length: 5000 }, (_, index) => ({
  id: index + 1,
  description: `Task ${index + 1}`,
  position: index + 1,
}));

const TaskListItem = ({ task, drag, isActive }) => {
  return (
    <OpacityDecorator activeOpacity={0.9}>
      <ScaleDecorator activeScale={1.05}>
        <View
          style={[
            styles.taskItem,
            { backgroundColor: isActive ? '#2C3E50' : '#1D2125' }
          ]}
        //onLongPress={drag}
        >
          <ThemedText lightColor="white" darkColor="white">{task.description}</ThemedText>
          <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
            <Text style={styles.dragHandleText}>≡</Text>
          </TouchableOpacity>
        </View>
      </ScaleDecorator>
    </OpacityDecorator>
  );
};

/*
const TaskListItem = ({ task, drag, isActive }) => {
  return (
    <ShadowDecorator>
      <ScaleDecorator>
        <OpacityDecorator>
          <TouchableOpacity
            activeOpacity={1}
            onLongPress={drag}
            disabled={isActive}
            style={[
              styles.taskItem,
              { backgroundColor: isActive ? "blue" : '#1D2125' },
            ]}
          >
            <ThemedText lightColor="white" darkColor="white">{task.description}</ThemedText>
          </TouchableOpacity>
        </OpacityDecorator>
      </ScaleDecorator>
    </ShadowDecorator>
  );
};*/

export default function TaskList() {
  const [tasks, setTasks] = useState(TASKS);
  const [newTask, setNewTask] = useState("");


  const createTask = () => {
    const id = tasks.length + 1;

    setTasks([...tasks, {
      id,
      description: newTask,
      position: tasks.length + 1,
    }]);
    setNewTask("");
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<typeof item>) => (
    <TaskListItem task={item} drag={drag} isActive={isActive} />
  );

  const [scrollEnable, setScrollEnable] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <Text style={styles.title}>Todo</Text>

        <DraggableFlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onDragBegin={() => setScrollEnable(false)}
          onDragEnd={({ data }) => {
            setTasks(data)
            setScrollEnable(true);
          }}
          activationDistance={scrollEnable ? 100 : 1}
          autoscrollSpeed={200}
        />

        {/* New task input */}
        <TextInput
          value={newTask}
          onChangeText={setNewTask}
          placeholder="New task"
          placeholderTextColor="gray"
          style={styles.input}
          onSubmitEditing={createTask}
        />
        <Button title="Add task" onPress={createTask} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#101112",
    padding: 10,
    borderRadius: 5,
    gap: 5,
    flex: 1,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  input: {
    color: "white",
    padding: 15,
    backgroundColor: "#1D2125",
    borderRadius: 5,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFF",
  },
  dragHandle: {
    padding: 10,
    backgroundColor: 'red',
  },
  dragHandleText: {
    color: 'white',
    fontSize: 24,
  },
});