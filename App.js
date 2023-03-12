import { render } from "preact"
import { useState } from "preact/hooks"
import Github from "./components/Github"
import Image from "antd/es/image"
import DropDown from "./components/DropDown"
import { Input, Button } from "antd"
import { WechatOutlined } from "@ant-design/icons"
import { Toaster, toast } from "react-hot-toast"
import { AnimatePresence, motion } from "framer-motion"
import ResizablePanel from "./components/ResizeableRanel"
import LoadingDots from "./components/LoadingDots"
import { promptObj } from "./src/const.js"
const { TextArea } = Input
const step1Image = new URL("./image/1-black.png", import.meta.url)
const step2Image = new URL("./image/2-black.png", import.meta.url)

const App = () => {
    const defaultDesc = '富婆女朋友六十大寿，帮我写一百字的生日祝福'
    const [desc, setDesc] = useState('')
    const [lang, setLang] = useState("直接发给chatgpt");
    const [loading, setLoading] = useState(false)
    const [generatedDescs, setGeneratedDescs] = useState("");
    let text = desc || defaultDesc
    const prompt = `${promptObj[lang] ? promptObj[lang] + ":\n" : ""} ${text}${text.slice(-1) === "." ? "" : "."}`

    const generateDesc = () => {
        setLoading(true)
        fetch('http://112.124.1.74:8080/chat', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
            }),
        }).then(async (req) => {
            const reader = req.body.getReader();
            const utf8Decoder = new TextDecoder('utf-8');
            while (true) {
                const { done, value } = await reader.read();
                //数据获取完成后，跑出循环
                if (done) {
                    setLoading(false)
                    return;
                }
                console.log(utf8Decoder.decode(value))
                setGeneratedDescs(utf8Decoder.decode(value))
            }
        }, () => {
            setLoading(false)
            setGeneratedDescs('网络错误，请重试')
        })

    }

    return <div class="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
        <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-2 sm:mt-4">
            <div className="flex flex-wrap justify-center space-x-5">
                <a
                    className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
                    href="https://github.com/CatsAndMice/lanlan"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Github />
                    <p>Star on GitHub</p>
                </a>

                <a
                    className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
                    href="http://112.124.1.74/static/img/05cbbe5741b75d97ca7900664cb53ece.wechat.png"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <WechatOutlined style={{
                        fontSize: '20px'
                    }} />
                    <p>凌览的微信</p>
                </a>
            </div>

            <h1 className="sm:text-3xl text-2xl max-w-1xl font-bold text-slate-900">
                智能文案小助手-览览
            </h1>
            <div className="max-w-xl w-full">
                <div className="flex mt-4 items-center space-x-3 mb-3">
                    <Image width={30}
                        height={30}
                        src={step1Image} />
                    <p className="text-left font-medium">
                        随便写点主题
                    </p>
                </div>

                <TextArea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    rows={4}
                    size='large'
                    className="my-2"
                    placeholder={
                        "e.g. " + defaultDesc
                    }
                />

                <div className="flex mb-5 items-center space-x-3">
                    <Image src={step2Image} width={30} height={30} alt="1 icon" />
                    <p className="text-left font-medium">选择目的.</p>
                </div>
                <DropDown vibe={lang} setVibe={(newLang) => setLang(newLang)} />
                {!loading && <Button className="mt-4" type="primary" block size='large' onClick={generateDesc}>生成 &rarr;</Button>}
                {loading && <Button className="mt-4" type="primary" disabled block size='large' ><LoadingDots /></Button>}
            </div>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{ duration: 2000 }}
            />
            <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
            <ResizablePanel>
                <AnimatePresence mode="wait">
                    <motion.div className="space-y-10 my-4">
                        {generatedDescs && (
                            <>
                                <div>
                                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                                        生成内容
                                    </h2>
                                </div>
                                <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto  whitespace-pre-wrap">

                                    <div
                                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border text-left"
                                        onClick={() => {
                                            navigator.clipboard.writeText(generatedDescs);
                                            toast("复制成功", {
                                                icon: "✂️",
                                            });
                                        }}
                                    >
                                        <p>{generatedDescs}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </ResizablePanel>
        </main>
    </div>
}


render(<App />, document.body)