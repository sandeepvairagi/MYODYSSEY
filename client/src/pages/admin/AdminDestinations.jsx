import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { destinationService } from '../../services/destinationService';
import { formatPrice, getImageUrl } from '../../utils/formatters';

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', location: '', country: '', category: 'beach',
    pricePerPerson: '', duration: '', highlights: '', included: '',
  });

  const load = () => destinationService.getAll({ limit: 50 }).then((res) => setDestinations(res.data.data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await destinationService.create({
        ...form,
        pricePerPerson: Number(form.pricePerPerson),
        duration: Number(form.duration),
        highlights: form.highlights.split(',').map((s) => s.trim()),
        included: form.included.split(',').map((s) => s.trim()),
        images: [{ url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600' }],
      });
      toast.success('Destination created');
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this destination?')) return;
    try {
      await destinationService.delete(id);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Destinations</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="w-5 h-5" /> Add New</button>
      </div>
      {showForm && (
        <form onSubmit={handleCreate} className="card p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" required />
          <input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input-field" required />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field capitalize">
            {['beach', 'mountain', 'city', 'adventure', 'cultural', 'wildlife', 'luxury', 'budget'].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input type="number" min="0" placeholder="Price Per Person (₹)" value={form.pricePerPerson} onChange={(e) => setForm({ ...form, pricePerPerson: e.target.value })} className="input-field" required />
          <input type="number" min="1" placeholder="Duration (days)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-field" required />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field md:col-span-2 h-24" required />
          <input placeholder="Highlights (comma separated)" value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} className="input-field" />
          <input placeholder="Included (comma separated)" value={form.included} onChange={(e) => setForm({ ...form, included: e.target.value })} className="input-field" />
          <button type="submit" className="btn-primary md:col-span-2">Create Destination</button>
        </form>
      )}
      <div className="space-y-4">
        {destinations.map((d) => (
          <div key={d._id} className="card p-4 flex items-center gap-4">
            <img
              src={getImageUrl(d)}
              alt=""
              className="w-20 h-16 object-cover rounded-lg"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';
              }}
            />
            <div className="flex-1">
              <h3 className="font-semibold">{d.title}</h3>
              <p className="text-sm text-gray-500">{d.location} · {formatPrice(d.pricePerPerson)}</p>
            </div>
            <button onClick={() => handleDelete(d._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
