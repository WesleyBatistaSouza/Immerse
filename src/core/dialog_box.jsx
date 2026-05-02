import { useState } from "react";
import { X, AlertCircle, Trash2 } from "lucide-react";

export default function DeleteBook({ bookTitle, onConfirm }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => setIsOpen((prev) => !prev);

  const handleConfirm = async () => {
    try {
      setLoading(true);

      if (onConfirm) {
        await onConfirm();
      }

      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão de deletar */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // IMPORTANTE: impede de abrir o livro
          toggleModal();
        }}
        className="p-1.5 rounded-xl bg-black/40 text-white border border-white/10 hover:bg-gray-900 cursor-pointer transition-all"
        title="Excluir livro"
        type="button"
      >
        <Trash2 size={13} />
      </button>

      {/* Modal de confirmação - CORRIGIDO: z-index alto */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={toggleModal}
        >
          <div
            className="relative w-full max-w-md animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1a1d23] border border-white/10 rounded-3xl shadow-2xl p-8">
              <button
                onClick={toggleModal}
                className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <AlertCircle size={30} />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Excluir Livro?
                </h3>

                <p className="text-gray-400 text-sm mb-8 px-4">
                  Você está prestes a remover{" "}
                  <span className="text-white font-medium">"{bookTitle}"</span>.
                  Esta ação não pode ser desfeita.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={toggleModal}
                    className="flex-1 py-3 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-2xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    CANCELAR
                  </button>

                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="flex-1 py-3 bg-red-600 text-white hover:bg-red-700 rounded-2xl text-xs font-bold cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {loading ? "EXCLUINDO..." : "CONFIRMAR"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}