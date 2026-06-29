import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { supabase } from "../../lib/supabase";
import CameraScreen from "../CameraScreen";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  async function loadTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return console.log(error.message);
    setTasks(data);
  }

  async function addTask() {
    if (task.trim() === "") return;
    const { error } = await supabase
      .from("tasks")
      .insert([{ title: task, completed: false }]);
    if (error) return console.log(error.message);
    setTask("");
    loadTasks();
  }

  async function toggleTask(item: Task) {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !item.completed })
      .eq("id", item.id);
    if (error) return console.log(error.message);
    loadTasks();
  }

  async function handleSubmitTask(title: string) {
    const { error } = await supabase
      .from("tasks")
      .insert([{ title, completed: false }]);
    if (error) {
      Toast.show({
        type: "error",
        text1: "Could not add task",
        text2: error.message,
      });
      return;
    }
    setModalVisible(false);
    loadTasks();
    Toast.show({ type: "success", text1: "Task added" });
  }

  async function handleDeleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      Toast.show({ type: "error", text1: "Could not delete task" });
      return;
    }
    loadTasks();
    Toast.show({ type: "success", text1: "Task deleted" });
  }

  function handleOpenModal() {
    setModalVisible(true);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return <CameraScreen />;
}

const headerStyles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#1F2A44" },
});

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: "#fff" },
});