import ProductHeader from "../components/ProductHeader";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { getOneData } from "../hooks/useFetch";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import EditInvoice from "../components/EditInvoice";
import DeleteModal from "../components/AlertModal";

function Product() {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getOneData(id)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("Xatolik yuz berdi:", err);
        setError("Ma'lumot yuklashda xatolik yuz berdi!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!data) {
    return <p>Ma'lumot topilmadi</p>;
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/data/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Xatolik yuz berdi!");
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };
  // hadnle paid
  const handlePaid = async () => {
    try {
      const response = await fetch(`http://localhost:3000/data/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "paid" }),
      });

      if (!response.ok) {
        throw new Error("Xatolik bor ");
      }
      const result = await response.json();
      setData(result);

      // window.location.href = "/";
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };
  return (
    <>
      <div className="align-elements mt-[64px] w-full">
        <Link
          to="/"
          className="flex gap-[10px] items-center mb-[32px] font-bold hover:underline"
        >
          <IoIosArrowBack /> Go back
        </Link>

        <ProductHeader />

        <div className="w-full list-a h-[500px] overflow-y-auto ">
          <div className="rounded-lg p-8 ">
            <div className="  grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h1 className="text-2xl font-bold">{data.id}</h1>
                <p className="text-[#7E88C3]">{data.description}</p>
              </div>
              <div className=" text-[#7E88C3] md:text-right">
                <p>{data.senderAddress?.street}</p>
                <p>{data.senderAddress?.city}</p>
                <p>{data.senderAddress?.postCode}</p>
                <p>{data.senderAddress?.country}</p>
              </div>
            </div>

            <div className="grid  grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-12">
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className=" text-[#7E88C3] mb-2">Invoice Date</h2>
                  <p className="text-xl font-bold">{data.createdAt}</p>
                </div>
                <div>
                  <h2 className="text-[#7E88C3] mb-2">Payment Due</h2>
                  <p className="text-xl font-bold">{data.paymentTerms}</p>
                </div>
              </div>
              <div>
                <h2 className="text-[#7E88C3] mb-2">Bill To</h2>
                <p className="text-xl font-bold mb-2">{data.clientName}</p>
                <div className="text-[#7E88C3]">
                  <p>{data.clientAddress.street}</p>
                  <p>{data.clientAddress.city}</p>
                  <p>{data.clientAddress.postCode}</p>
                  <p>{data.clientAddress.country}</p>
                </div>
              </div>
              <div>
                <h2 className="text-[#7E88C3] mb-2">Sent to</h2>
                <p className="text-xl font-bold">{data.clientEmail}</p>
              </div>
            </div>

            <div className="rounded-lg md:p-8 mb-8">
              <table className="w-full">
                <thead>
                  <tr className="text-c">
                    <th className="text-left">Item Name</th>
                    <th className="text-center ">QTY.</th>
                    <th className="text-right ">Price</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="py-4 font-bold">{item.name}</td>
                      <td className="text-center text-c">{item.quantity}</td>
                      <td className="text-right text-c">{item.price}</td>
                      <td className="text-right font-bold">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-8 flex justify-between items-center">
              <span className="text-lg">Amount Due</span>
              <span className="text-3xl font-bold">{data.total}</span>
            </div>
          </div>
        </div>

        {/* mobile uchun header
         */}
        <div className="align-elements flex   items-center justify-between px-[32px] py-[24px] list-a rounded-lg mb-[24px] md:hidden ">
          <div className="flex justify-around gap-[8px] w-full ">
            <EditInvoice />
            <button
              className="btn btn-error rounded-3xl"
              onClick={() => setIsModalOpen(true)}
            >
              Delete
            </button>
            {data?.status !== "paid" ? (
              <button
                className="btn btn-primary rounded-3xl"
                onClick={handlePaid}
              >
                Mark as Paid
              </button>
            ) : (
              ""
            )}
          </div>

          {/* Modal */}
          <DeleteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => {
              setIsModalOpen(false);
              handleDelete();
            }}
            invoiceId={data?.id}
          />
        </div>
      </div>
    </>
  );
}

export default Product;
