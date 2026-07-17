import { useMemo, useState } from "react";
import { Trash2, Database, Search, Eye } from "lucide-react";

const datasets = [
  {
    name: "Wright stain training set",
    stain: "Wright",
    images: "4,820",
    status: "Pending",
    created: "May 16, 2026",
    email: "user1@example.com",
  },
  {
    name: "Giemsa stain validation set",
    stain: "Giemsa",
    images: "2,940",
    status: "Complete",
    created: "May 15, 2026",
    email: "user1@example.com",
  },
  {
    name: "Manual review samples",
    stain: "Wright",
    images: "368",
    status: "Pending",
    created: "Today",
    email: "user1@example.com",
  },
];

const statusClass = {
  Complete: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
};

const parseImageCount = (images) =>
  Number(String(images).replace(/,/g, "")) || 0;

function AdminDataManagement() {
  const [datasetList, setDatasetList] = useState(datasets);
  const [search, setSearch] = useState("");
  const [, setSelectedDataset] = useState(null);

  const filteredDatasets = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return datasetList.filter((dataset) => {
      const matchesSearch =
        !keyword ||
        dataset.name.toLowerCase().includes(keyword) ||
        dataset.email.toLowerCase().includes(keyword);
      return matchesSearch;
    });
  }, [datasetList, search]);

  const summary = useMemo(() => {
    const totalImages = datasetList.reduce(
      (total, dataset) => total + parseImageCount(dataset.images),
      0,
    );
    const wrightImages = datasetList
      .filter((dataset) => dataset.stain.toLowerCase() === "wright")
      .reduce((total, dataset) => total + parseImageCount(dataset.images), 0);
    const giemsaImages = datasetList
      .filter((dataset) => dataset.stain.toLowerCase() === "giemsa")
      .reduce((total, dataset) => total + parseImageCount(dataset.images), 0);

    return {
      totalImages: totalImages.toLocaleString(),
      datasets: datasetList.length,
      wrightImages: wrightImages.toLocaleString(),
      giemsaImages: giemsaImages.toLocaleString(),
    };
  }, [datasetList]);

  const deleteDataset = (datasetName) => {
    const confirmed = window.confirm("Delete this dataset?");

    if (!confirmed) return;

    setDatasetList((currentDatasets) =>
      currentDatasets.filter((dataset) => dataset.name !== datasetName),
    );
    setSelectedDataset((currentDataset) =>
      currentDataset?.name === datasetName ? null : currentDataset,
    );
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            Data Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Organize datasets, uploaded images, stains, and review samples.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-lg font-medium text-slate-500">Total Images</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {summary.totalImages}
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-lg font-medium text-slate-500">Datasets</p>
          <p className="mt-3 text-3xl font-bold text-blue-600">
            {summary.datasets}
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-lg font-medium text-slate-500">Wright Stain</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">
            {summary.wrightImages}
          </p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Giemsa Stain</p>
          <p className="mt-3 text-3xl font-bold text-violet-600">
            {summary.giemsaImages}
          </p>
        </article>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <h2 className="text-lg font-bold text-slate-950">Datasets</h2>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search dataset"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Dataset</th>
                <th className="px-6 py-3 font-semibold">Stain</th>
                <th className="px-6 py-3 font-semibold">Images</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Created at</th>
                <th className="px-6 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDatasets.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    ไม่พบข้อมูล dataset
                  </td>
                </tr>
              )}

              {filteredDatasets.map((dataset) => (
                <tr key={dataset.name}>
                  <td className="px-6 py-4">
                    {/* <p><FileImage className="h-4 w-4" aria-hidden="true" /></p> */}
                    {/* <div className="flex items-center gap-3"> */}
                    {/* <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
                        <FileImage className="h-4 w-4" aria-hidden="true" />
                      </span> */}
                    <p className="font-semibold text-slate-950">
                      {dataset.name}
                    </p>
                    <p className="hidden text-slate-500 sm:block">
                      {dataset.email}
                    </p>
                    {/* </div> */}
                  </td>
                  <td className="px-6 py-4 text-slate-700">{dataset.stain}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {dataset.images}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[dataset.status]}`}
                    >
                      {dataset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {dataset.created}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDataset(dataset)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        aria-label={`View ${dataset.name}`}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteDataset(dataset.name)}
                        className="rounded-lg border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-50"
                        aria-label={`Delete ${dataset.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                  {/* <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
                        <Edit3 className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button className="rounded-lg border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-50">
                        <Ban className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

export default AdminDataManagement;
