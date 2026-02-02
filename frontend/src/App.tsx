import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { TaskList } from '@/components/task/TaskList';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Container>
        <TaskList />
      </Container>
    </div>
  );
}

export default App;
