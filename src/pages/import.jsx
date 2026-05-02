import { useState, useRef } from "react";
import { Upload, ImagePlus, Check, FileText, Loader2 } from "lucide-react";
import * as pdfjsLib from 'pdfjs-dist'; 
import { notifyError } from "../core/notification";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function Import({ onAddBook }) {
  const [step, setStep] = useState("idle");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    category: "Fantasia",
    cover: null,
    file: null,
    favorite: false
  });

  const imageInputRef = useRef(null);

  const saveAndFinish = () => {
    if (!bookData.file) {
      console.log("Erro: O conteúdo do PDF não foi processado corretamente.");
      return;
    }

    onAddBook(bookData);
    setStep("success");
    setIsCustomCategory(false);
    
    setBookData({
      title: "",
      author: "",
      category: "Fantasia",
      cover: null,
      file: null,
      favorite: false
    });
  };

  const sanitizeTitle = (fileName) => {
    return fileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const extractPdfCover = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1); 

      const viewport = page.getViewport({ scale: 2 }); 
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Erro ao extrair capa do PDF:', error);
      return null; 
    }
  };

  const handleFileDrop = async (e) => {
    const file = e.target.files[0];
    
    if (file && file.type === "application/pdf") {
      setIsProcessing(true);

      try {
        const coverImage = await extractPdfCover(file);

        setBookData((prev) => ({
          ...prev,
          title: sanitizeTitle(file.name),
          file: file,
          cover: coverImage
        }));
        
        setStep("editing");
      } catch (error) {
        notifyError("Houve um erro ao processar o PDF. Tente novamente.");
        console.error('Erro ao processar PDF:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookData((prev) => ({ ...prev, cover: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "Outros") {
      setIsCustomCategory(true);
      setBookData((prev) => ({ ...prev, category: "" }));
    } else {
      setBookData((prev) => ({ ...prev, category: value }));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-in fade-in">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold font-serif">Nova Experiência</h1>
        <p className="text-gray-500 text-sm">Adicione um PDF à sua biblioteca imersiva.</p>
      </header>

      {step === "idle" && (
        <label className="flex flex-col items-center justify-center w-full h-80 bg-[#1a1d23]/40 border-2 border-dashed border-white/5 rounded-[2.5rem] cursor-pointer hover:bg-[#1a1d23] hover:border-blue-500/50 transition-all group">
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="p-5 bg-gray-800 rounded-3xl mb-4 group-hover:bg-blue-600 transition-colors">
              {isProcessing ? (
                <Loader2 size={32} className="text-white animate-spin" />
              ) : (
                <Upload size={32} className="text-white" />
              )}
            </div>
            <p className="text-white font-bold font-sans">
              {isProcessing ? "Processando PDF e extraindo capa..." : "Solte seu PDF aqui"}
            </p>
            <p className="text-xs text-gray-500 mt-2 font-sans">
              {isProcessing 
                ? "Aguarde enquanto processamos seu livro" 
                : "A capa será extraída automaticamente da primeira página"}
            </p>
          </div>
          <input type="file" className="hidden" accept=".pdf" onChange={handleFileDrop} disabled={isProcessing} />
        </label>
      )}

      {step === "editing" && (
        <div className="bg-[#1a1d23] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex flex-col gap-4">
            
              <div 
                onClick={() => imageInputRef.current.click()}
                className="aspect-[2/3] bg-gray-800 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-white/5 overflow-hidden relative group cursor-pointer"
              >
                {bookData.cover ? (
                  <>
                    <img src={bookData.cover} className="w-full h-full object-cover" alt="Preview" />
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-center">
                        <ImagePlus size={32} className="text-white mb-2 mx-auto" />
                        <p className="text-xs text-white font-bold">Clique para trocar a capa</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <ImagePlus size={32} className="text-gray-600 mb-2 group-hover:text-blue-500 transition-colors" />
                    <p className="text-[10px] text-gray-500 uppercase font-black font-sans text-center px-4">
                      Não foi possível extrair capa automaticamente
                    </p>
                    <p className="text-[9px] text-gray-600 mt-2 font-sans text-center px-4">
                      Clique para adicionar manualmente
                    </p>
                  </>
                )}
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
              
              <div className="flex items-center gap-2 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                <FileText size={16} className="text-blue-400" />
                <span className="text-[10px] text-blue-200 font-bold truncate flex-1">{bookData.title}.pdf</span>
              </div>
            </div>

            <div className="flex-1 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest font-sans">Título</label>
                <input 
                  value={bookData.title}
                  onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                  className="w-full bg-gray-800/50 border border-white/5 p-4 rounded-xl text-white focus:border-blue-500 outline-none font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest font-sans">Autor</label>
                <input 
                  value={bookData.author}
                  onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
                  className="w-full bg-gray-800/50 border border-white/5 p-4 rounded-xl text-white focus:border-blue-500 outline-none font-sans"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest font-sans">Categoria</label>
                {!isCustomCategory ? (
                  <select
                    value={bookData.category}
                    onChange={handleCategoryChange}
                    className="w-full bg-gray-800/50 border border-white/5 p-4 rounded-xl text-white focus:border-blue-500 outline-none font-sans cursor-pointer"
                  >
                    <option value="Fantasia">Fantasia</option>
                    <option value="Distopia">Distopia</option>
                    <option value="Infantil">Infantil</option>
                    <option value="Terror">Terror</option>
                    <option value="Outros">Outros...</option>
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      autoFocus
                      placeholder="Nova categoria..."
                      value={bookData.category}
                      onChange={(e) => setBookData({ ...bookData, category: e.target.value })}
                      className="w-full bg-gray-800/50 border border-purple-500/50 p-4 rounded-xl text-white outline-none font-sans"
                    />
                    <button onClick={() => setIsCustomCategory(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-purple-400 font-bold cursor-pointer">VOLTAR</button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setStep("idle")} className="flex-1 py-4 bg-gray-800 text-white rounded-2xl font-bold text-xs font-sans cursor-pointer">CANCELAR</button>
                <button onClick={saveAndFinish} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-600/20 font-sans cursor-pointer">ADICIONAR</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="text-center py-20 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white">Livro Adicionado!</h2>
          <p className="text-gray-400 mt-2">Sua biblioteca local cresceu.</p>
          <button onClick={() => setStep("idle")} className="mt-8 px-8 py-3 bg-blue-600 rounded-full font-bold text-sm text-white cursor-pointer">Importar outro</button>
        </div>
      )}
    </div>
  );
}