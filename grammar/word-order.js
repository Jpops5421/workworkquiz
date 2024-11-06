import OrderingPractice from '../../components/OrderingPractice';
import Layout from '../../components/Layout';

export default function WordOrderPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Word Order Practice</h1>
        <OrderingPractice />
      </div>
    </Layout>
  );
} 