import { Select } from "antd"
import { promptObj } from "../src/const.js"

const vibes = Array.from(Object.keys(promptObj))

export default function DropDown({ vibe = '', setVibe = () => { } }) {

    return <Select
        value={vibe}
        onChange={setVibe}
        size='large'
        style={{
            width: '100%',
            textAlign: 'left'
        }}
        options={vibes.map((item) => ({
            value: item,
            label: item,
        }))}
    />
}