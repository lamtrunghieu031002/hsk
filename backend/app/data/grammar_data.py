# Complete HSK 1 - 6 Grammar Points (48 points: 8 points per level)
GRAMMAR_DATA = [
    # ================= HSK 1 =================
    {
        "hsk_level": 1,
        "pattern": "Subject + 是 + Noun",
        "title_vi": "Câu phán đoán khẳng định với 是 (Là, thì)",
        "explanation_vi": "Dùng để xác định danh tính, nghề nghiệp, quốc tịch của chủ ngữ. Phủ định dùng 不是.",
        "examples": [
            {"chinese": "我是学生。", "pinyin": "Wǒ shì xuésheng.", "meaning_vi": "Tôi là học sinh."},
            {"chinese": "他不是中国人，他是越南人。", "pinyin": "Tā bú shì Zhōngguó rén, tā shì Yuènán rén.", "meaning_vi": "Anh ấy không phải người Trung Quốc, anh ấy là người Việt Nam."}
        ]
    },
    {
        "hsk_level": 1,
        "pattern": "Subject / Place + 有 + Object",
        "title_vi": "Câu chữ 有 biểu thị sự sở hữu và tồn tại",
        "explanation_vi": "Biểu thị ai đó có cái gì hoặc tại một vị trí có đồ vật/người nào đó. Phủ định bắt buộc dùng 没有 (không dùng 不有).",
        "examples": [
            {"chinese": "我有一台电脑。", "pinyin": "Wǒ yǒu yì tái diànnǎo.", "meaning_vi": "Tôi có một chiếc máy tính."},
            {"chinese": "桌子上没有水杯。", "pinyin": "Zhuōzi shang méiyǒu shuǐbēi.", "meaning_vi": "Trên bàn không có cốc nước."}
        ]
    },
    {
        "hsk_level": 1,
        "pattern": "Statement + 吗？",
        "title_vi": "Câu hỏi nghi vấn với trợ từ 吗",
        "explanation_vi": "Thêm trợ từ 吗 vào cuối câu trần thuật để tạo thành câu hỏi Có... không?",
        "examples": [
            {"chinese": "你喜欢喝中国茶吗？", "pinyin": "Nǐ xǐhuan hē Zhōngguó chá ma?", "meaning_vi": "Bạn có thích uống trà Trung Quốc không?"},
            {"chinese": "明天你来学校吗？", "pinyin": "Míngtiān nǐ lái xuéxiào ma?", "meaning_vi": "Ngày mai bạn đến trường không?"}
        ]
    },
    {
        "hsk_level": 1,
        "pattern": "Subject + Verb + 什么 (+ Noun)？",
        "title_vi": "Câu hỏi với đại từ nghi vấn 什么 (Cái gì)",
        "explanation_vi": "Đại từ 什么 đứng ở vị trí tân ngữ hoặc làm định ngữ cho danh từ phía sau để hỏi về sự vật/nội dung.",
        "examples": [
            {"chinese": "你想买什么？", "pinyin": "Nǐ xiǎng mǎi shénme?", "meaning_vi": "Bạn muốn mua cái gì?"},
            {"chinese": "你在看什么书？", "pinyin": "Nǐ zài kàn shénme shū?", "meaning_vi": "Bạn đang đọc sách gì thế?"}
        ]
    },
    {
        "hsk_level": 1,
        "pattern": "Modifier + 的 + Noun",
        "title_vi": "Trợ từ kết cấu 的 biểu thị sở hữu và định ngữ",
        "explanation_vi": "Đặt 的 giữa định ngữ và danh từ trung tâm để biểu thị quyền sở hữu (của ai) hoặc tính chất bổ nghĩa.",
        "examples": [
            {"chinese": "这是我的汉语老师。", "pinyin": "Zhè shì wǒ de Hànyǔ lǎoshī.", "meaning_vi": "Đây là giáo viên tiếng Trung của tôi."},
            {"chinese": "红色的衣服很漂亮。", "pinyin": "Hóngsè de yīfu hěn piàoliang.", "meaning_vi": "Bộ quần áo màu đỏ rất đẹp."}
        ]
    },
    {
        "hsk_level": 1,
        "pattern": "Noun / Pronoun + 呢？",
        "title_vi": "Câu hỏi tỉnh lược ngữ cảnh với 呢 (Còn... thì sao?)",
        "explanation_vi": "Dùng 呢 sau danh từ hoặc đại từ để hỏi về vị trí của sự vật hoặc hỏi lại câu hỏi của người trước trong ngữ cảnh.",
        "examples": [
            {"chinese": "我是越南人，你呢？", "pinyin": "Wǒ shì Yuènán rén, nǐ ne?", "meaning_vi": "Tôi là người Việt Nam, còn bạn thì sao?"},
            {"chinese": "我的手机呢？", "pinyin": "Wǒ de shǒujī ne?", "meaning_vi": "Điện thoại của tôi đâu rồi nhỉ?"}
        ]
    },
    {
        "hsk_level": 1,
        "pattern": "Subject + Verb + Object + 了",
        "title_vi": "Trợ từ động thái 了 biểu thị hành động đã hoàn thành",
        "explanation_vi": "Đặt 了 sau động từ hoặc cuối câu biểu thị hành động đã xảy ra hoặc có sự biến đổi trạng thái mới.",
        "examples": [
            {"chinese": "他去北京旅游了。", "pinyin": "Tā qù Běijīng lǚyóu le.", "meaning_vi": "Anh ấy đã đi Bắc Kinh du lịch rồi."},
            {"chinese": "我已经吃过饭了。", "pinyin": "Wǒ yǐjīng chī guo fàn le.", "meaning_vi": "Tôi đã ăn cơm rồi."}
        ]
    },
    {
        "hsk_level": 1,
        "pattern": "Subject + 很 + Adjective",
        "title_vi": "Câu miêu tả vị ngữ tính từ với 很",
        "explanation_vi": "Trong tiếng Trung, trước vị ngữ tính từ thường có phó từ 很 (rất). Khi đọc nhẹ, 很 chỉ đóng vai trò cân bằng cấu trúc ngữ âm chứ không mang nghĩa tuyệt đối 'rất'.",
        "examples": [
            {"chinese": "今天天气很好。", "pinyin": "Jīntiān tiānqì hěn hǎo.", "meaning_vi": "Thời tiết hôm nay tốt."},
            {"chinese": "这个苹果很大很甜。", "pinyin": "Zhè gè píngguǒ hěn dà hěn tián.", "meaning_vi": "Quả táo này to và ngọt."}
        ]
    },

    # ================= HSK 2 =================
    {
        "hsk_level": 2,
        "pattern": "A + 比 + B + Adjective (+ Quantity / 得多 / 一点儿)",
        "title_vi": "Cấu trúc câu so sánh hơn với 比",
        "explanation_vi": "Dùng để so sánh tính chất giữa hai đối tượng A và B. Lưu ý không dùng phó từ 很/非常/太 trước tính từ so sánh.",
        "examples": [
            {"chinese": "今天比昨天冷得多。", "pinyin": "Jīntiān bǐ zuótiān lěng de duō.", "meaning_vi": "Hôm nay lạnh hơn hôm qua rất nhiều."},
            {"chinese": "我哥哥比我大三岁。", "pinyin": "Wǒ gēge bǐ wǒ dà sān suì.", "meaning_vi": "Anh trai lớn hơn tôi 3 tuổi."}
        ]
    },
    {
        "hsk_level": 2,
        "pattern": "Subject + Verb + 着 + (Object)",
        "title_vi": "Trợ từ động thái 着 biểu thị trạng thái đang duy trì",
        "explanation_vi": "Đứng sau động từ để biểu thị động tác đang tiếp diễn hoặc trạng thái của sự vật đang được duy trì liên tục.",
        "examples": [
            {"chinese": "大门开着呢，请进吧。", "pinyin": "Dàmén kāi zhe ne, qǐng jìn ba.", "meaning_vi": "Cửa lớn đang mở đấy, xin mời vào."},
            {"chinese": "老师站着讲课。", "pinyin": "Lǎoshī zhàn zhe jiǎngkè.", "meaning_vi": "Thầy giáo đứng giảng bài."}
        ]
    },
    {
        "hsk_level": 2,
        "pattern": "Subject + Verb + 过 + (Object)",
        "title_vi": "Trợ từ động thái 过 biểu thị kinh nghiệm từng trải",
        "explanation_vi": "Đứng sau động từ để nhấn mạnh chủ ngữ đã từng trải qua hành động đó trong quá khứ. Phủ định dùng 没 + Động từ + 过.",
        "examples": [
            {"chinese": "我去过中国两次。", "pinyin": "Wǒ qù guo Zhōngguó liǎng cì.", "meaning_vi": "Tôi từng đến Trung Quốc hai lần."},
            {"chinese": "我没吃过这种水果。", "pinyin": "Wǒ méi chī guo zhè zhǒng shuǐguǒ.", "meaning_vi": "Tôi chưa từng ăn loại trái cây này bao giờ."}
        ]
    },
    {
        "hsk_level": 2,
        "pattern": "Verb + 得 + Adjective / Complement",
        "title_vi": "Bổ ngữ trạng thái với trợ từ kết cấu 得",
        "explanation_vi": "Dùng 得 sau động từ để nối với tính từ nhằm đánh giá, miêu tả mức độ hoặc kết quả thường xuyên của động tác.",
        "examples": [
            {"chinese": "他说汉语说得非常流利。", "pinyin": "Tā shuō Hànyǔ shuō de fēicháng liúlì.", "meaning_vi": "Anh ấy nói tiếng Trung rất lưu loát."},
            {"chinese": "昨晚我睡得很好。", "pinyin": "Zuówǎn wǒ shuì de hěn hǎo.", "meaning_vi": "Tối qua tôi ngủ rất ngon giấc."}
        ]
    },
    {
        "hsk_level": 2,
        "pattern": "Option A + 还是 + Option B？",
        "title_vi": "Câu hỏi lựa chọn với 还是 (Hay là)",
        "explanation_vi": "Dùng trong câu hỏi lựa chọn giữa hai hay nhiều phương án. Trong câu trần thuật dùng 或者 thay vì 还是.",
        "examples": [
            {"chinese": "你想喝咖啡还是喝茶？", "pinyin": "Nǐ xiǎng hē kāfēi háishi hē chá?", "meaning_vi": "Bạn muốn uống cà phê hay là uống trà?"},
            {"chinese": "我们明天去还是后天去？", "pinyin": "Wǒmen míngtiān qù háishi hòutiān qù?", "meaning_vi": "Chúng mình ngày mai đi hay là ngày mốt đi?"}
        ]
    },
    {
        "hsk_level": 2,
        "pattern": "Subject + 快要 / 就要 + Verb + 了",
        "title_vi": "Cấu trúc biểu thị hành động sắp xảy ra 快要...了",
        "explanation_vi": "Biểu thị một hành động hoặc trạng thái sắp sửa xảy ra trong thời gian rất ngắn tới.",
        "examples": [
            {"chinese": "火车快要开走了，快上车！", "pinyin": "Huǒchē kuàiyào kāizǒu le, kuài shàng chē!", "meaning_vi": "Tàu hỏa sắp chạy rồi, mau lên xe đi!"},
            {"chinese": "新年就要到了。", "pinyin": "Xīnnián jiù yào dào le.", "meaning_vi": "Năm mới sắp sửa đến rồi."}
        ]
    },
    {
        "hsk_level": 2,
        "pattern": "因为 + Reason, 所以 + Result",
        "title_vi": "Cặp liên từ chỉ nguyên nhân kết quả 因为...所以...",
        "explanation_vi": "Dùng để diễn đạt quan hệ nhân quả. Vì có nguyên nhân ở vế 1 nên dẫn tới kết quả ở vế 2.",
        "examples": [
            {"chinese": "因为昨天下大雨，所以我们没去公园。", "pinyin": "Yīnwèi zuótiān xià dàyǔ, suǒyǐ wǒmen méi qù gōngyuán.", "meaning_vi": "Vì hôm qua trời mưa to nên chúng tôi không đi công viên."},
            {"chinese": "因为他每天都认真复习，所以考了满分。", "pinyin": "Yīnwèi tā měitiān dōu rènzhēn fùxí, suǒyǐ kǎo le mǎnfēn.", "meaning_vi": "Bởi vì ngày nào cậu ấy cũng chăm chỉ ôn tập nên đã đạt điểm tuyệt đối."}
        ]
    },
    {
        "hsk_level": 2,
        "pattern": "虽然 + Clause 1, 但是 + Clause 2",
        "title_vi": "Cặp liên từ chuyển ý nhượng bộ 虽然...但是...",
        "explanation_vi": "Diễn đạt quan hệ tương phản, tuy vế đầu thừa nhận một sự thật nhưng vế sau chuyển hướng ý kiến ngược lại.",
        "examples": [
            {"chinese": "虽然学汉字很难，但是很有意思。", "pinyin": "Suīrán xué Hànzì hěn nán, dànshì hěn yǒu yìsi.", "meaning_vi": "Tuy rằng học chữ Hán rất khó, nhưng rất thú vị."},
            {"chinese": "虽然身体有点累，但是我心情很愉快。", "pinyin": "Suīrán shēntǐ yǒudiǎnr lèi, dànshì wǒ xīinqíng hěn yúkuài.", "meaning_vi": "Tuy cơ thể hơi mệt một chút, nhưng tâm trạng tôi rất vui vẻ."}
        ]
    },

    # ================= HSK 3 =================
    {
        "hsk_level": 3,
        "pattern": "Subject + 把 + Object + Verb + Other Component",
        "title_vi": "Câu chữ 把 (Câu xử lý Ba nhấn mạnh tác động lên tân ngữ)",
        "explanation_vi": "Dùng khi người nói muốn nhấn mạnh việc hành động tác động làm thay đổi vị trí, trạng thái hoặc tính chất của tân ngữ xác định.",
        "examples": [
            {"chinese": "请把桌子上的书拿给我。", "pinyin": "Qǐng bǎ zhuōzi shang de shū ná gěi wǒ.", "meaning_vi": "Xin hãy lấy quyển sách trên bàn đưa cho tôi."},
            {"chinese": "他把房间打扫得很干净。", "pinyin": "Tā bǎ fángjiān dǎsǎo de hěn gānjìng.", "meaning_vi": "Cậu ấy đã dọn dẹp căn phòng sạch sẽ tinh tươm."}
        ]
    },
    {
        "hsk_level": 3,
        "pattern": "Subject + 被 + (Agent) + Verb + Other Component",
        "title_vi": "Câu chữ 被 (Câu bị động)",
        "explanation_vi": "Biểu thị chủ ngữ chịu sự tác động bởi một tác nhân khác, thường mang sắc thái không mong muốn hoặc bị thiệt hại.",
        "examples": [
            {"chinese": "我的自行车被小偷偷走了。", "pinyin": "Wǒ de zìxíngchē bèi xiǎotōu tōu zǒu le.", "meaning_vi": "Xe đạp của tôi đã bị kẻ trộm lấy cắp mất rồi."},
            {"chinese": "蛋糕被弟弟吃光了。", "pinyin": "Dàngāo bèi dìdi chī guāng le.", "meaning_vi": "Bánh ngọt đã bị em trai ăn hết sạch."}
        ]
    },
    {
        "hsk_level": 3,
        "pattern": "Verb + (一) + Verb / Verb + 一下",
        "title_vi": "Sự trùng điệp của động từ (Làm thử / Thư giãn)",
        "explanation_vi": "Trùng điệp động từ biểu thị động tác diễn ra trong thời gian ngắn, có tính chất thử nghiệm, nhẹ nhàng thoải mái.",
        "examples": [
            {"chinese": "这件新衣服你想试一试吗？", "pinyin": "Zhè jiàn xīn yīfu nǐ xiǎng shì yí shì ma?", "meaning_vi": "Bộ quần áo mới này bạn có muốn mặc thử một chút không?"},
            {"chinese": "请大家休息一下。", "pinyin": "Qǐng dàjiā xiūxi yíxià.", "meaning_vi": "Xin mời mọi người nghỉ ngơi một lát."}
        ]
    },
    {
        "hsk_level": 3,
        "pattern": "越 + A + 越 + B",
        "title_vi": "Cấu trúc 越...越... (Càng... càng...)",
        "explanation_vi": "Biểu thị mức độ của B sẽ biến đổi tăng dần theo sự biến đổi mức độ của A.",
        "examples": [
            {"chinese": "雨越下越大。", "pinyin": "Yǔ yuè xià yuè dà.", "meaning_vi": "Mưa càng lúc càng rơi to."},
            {"chinese": "汉语学得越深，越觉得有趣。", "pinyin": "Hànyǔ xué de yuè shēn, yuè juéde yǒuqù.", "meaning_vi": "Tiếng Trung học càng sâu càng cảm thấy thú vị."}
        ]
    },
    {
        "hsk_level": 3,
        "pattern": "一边 + Action 1, 一边 + Action 2",
        "title_vi": "Cấu trúc 一边...一边... (Vừa làm việc này vừa làm việc kia)",
        "explanation_vi": "Biểu thị hai hành động xảy ra song song đồng thời cùng một lúc.",
        "examples": [
            {"chinese": "他喜欢一边听音乐，一边写作业。", "pinyin": "Tā xǐhuan yìbiān tīng yīnyuè, yìbiān xiě zuòyè.", "meaning_vi": "Cậu ấy thích vừa nghe nhạc vừa làm bài tập."},
            {"chinese": "我们一边喝咖啡一边聊天。", "pinyin": "Wǒmen yìbiān hē kāfēi yìbiān liáotiān.", "meaning_vi": "Chúng tôi vừa uống cà phê vừa trò chuyện."}
        ]
    },
    {
        "hsk_level": 3,
        "pattern": "Verb + 完 / 好 / 见 / 到 (Bổ ngữ kết quả)",
        "title_vi": "Bổ ngữ kết quả chỉ hành động đạt trạng thái kết thúc",
        "explanation_vi": "Các từ 完, 好, 见, 到 đứng ngay sau động từ làm bổ ngữ chỉ rõ kết quả của hành động đã hoàn tất mỹ mãn hoặc đạt mục đích.",
        "examples": [
            {"chinese": "我做完作业了。", "pinyin": "Wǒ zuòwán zuòyè le.", "meaning_vi": "Tôi đã làm xong bài tập rồi."},
            {"chinese": "饭菜准备好了，快来吃吧。", "pinyin": "Fàncài zhǔnbèi hǎo le, kuài lái chī ba.", "meaning_vi": "Cơm nước đã chuẩn bị xong xuôi rồi, mau tới ăn thôi."}
        ]
    },
    {
        "hsk_level": 3,
        "pattern": "先 + Action 1, 然后 + Action 2",
        "title_vi": "Cấu trúc tuần tự thời gian 先...然后... (Trước tiên... sau đó...)",
        "explanation_vi": "Biểu thị trình tự trước sau của hai hay nhiều hành động theo tiến trình thời gian.",
        "examples": [
            {"chinese": "我们先去买票，然后进电影院。", "pinyin": "Wǒmen xiān qù mǎi piào, ránhòu jìn diànyǐngyuàn.", "meaning_vi": "Chúng ta đi mua vé trước, sau đó mới vào rạp chiếu phim."},
            {"chinese": "先洗手，然后才能吃苹果。", "pinyin": "Xiān xǐshǒu, ránhòu cái néng chī píngguǒ.", "meaning_vi": "Trước tiên rửa tay, sau đó mới được ăn táo."}
        ]
    },
    {
        "hsk_level": 3,
        "pattern": "除了 + A + 以外, (Subject) + 还 / 也 + B",
        "title_vi": "Cấu trúc bổ sung 除了...以外，还/也...",
        "explanation_vi": "Biểu thị ngoài đối tượng A ra, còn có thêm cả đối tượng B (quan hệ bổ sung thêm).",
        "examples": [
            {"chinese": "除了英语以外，他还会说一口流利的汉语。", "pinyin": "Chúle Yīngyǔ yǐwài, tā hái huì shuō yì kǒu liúlì de Hànyǔ.", "meaning_vi": "Ngoài tiếng Anh ra, anh ấy còn biết nói một giọng tiếng Trung lưu loát."},
            {"chinese": "除了周末以外，图书馆每天都开门。", "pinyin": "Chúle zhōumò yǐwài, túshūguǎn měitiān dōu kāimén.", "meaning_vi": "Ngoài cuối tuần ra, thư viện ngày nào cũng mở cửa."}
        ]
    },

    # ================= HSK 4 =================
    {
        "hsk_level": 4,
        "pattern": "不仅 + Clause 1, 而且 + Clause 2",
        "title_vi": "Cặp liên từ tăng tiến 不仅...而且... (Không những... mà còn...)",
        "explanation_vi": "Biểu đạt ý nghĩa vế sau bổ sung nâng cao thêm một bậc so với vế trước.",
        "examples": [
            {"chinese": "他不仅学习成绩优秀，而且乐于帮助同学。", "pinyin": "Tā bùjǐn xuéxí chéngjì yōuxiù, érqiě lèyú bāngzhù tóngxué.", "meaning_vi": "Cậu ấy không những thành tích học tập xuất sắc mà còn rất thích giúp đỡ bạn bè."},
            {"chinese": "这道菜不仅色泽诱人，而且味道极好。", "pinyin": "Zhè dào cài bùjǐn sèzé yòurén, érqiě wèidào jí hǎo.", "meaning_vi": "Món ăn này không những màu sắc hấp dẫn mà mùi vị còn cực ngon."}
        ]
    },
    {
        "hsk_level": 4,
        "pattern": "即使 + Hypothesis, 也 + Result",
        "title_vi": "Cặp liên từ giả thiết nhượng bộ 即使...也... (Cho dù... cũng...)",
        "explanation_vi": "Đưa ra một giả thiết mang tính cực đoan ở vế 1, và khẳng định vế 2 vẫn giữ nguyên không thay đổi.",
        "examples": [
            {"chinese": "即使遇到再大的挫折，我们也不能放弃希望。", "pinyin": "Jíshǐ yù dào zài dà de cuòzhé, wǒmen yě bù néng fàngqì xīwàng.", "meaning_vi": "Cho dù gặp phải trắc trở lớn đến đâu, chúng ta cũng không thể từ bỏ hy vọng."},
            {"chinese": "即使明天下大暴雨，比赛也照常举行。", "pinyin": "Jíshǐ míngtiān xià dà bàoyǔ, bǐsài yě zhàocháng jǔxíng.", "meaning_vi": "Cho dù ngày mai có mưa bão lớn, trận đấu vẫn diễn ra bình thường."}
        ]
    },
    {
        "hsk_level": 4,
        "pattern": "既然 + Premise, 就 + Conclusion",
        "title_vi": "Cặp liên từ nhân quả giả thiết 既然...就... (Đã... thì...)",
        "explanation_vi": "Dựa trên tiền đề hoặc sự thật đã được xác nhận ở vế trước để rút ra kết luận, quyết định hợp lý ở vế sau.",
        "examples": [
            {"chinese": "既然大家意见一致，我们就按这个计划执行。", "pinyin": "Jìrán dàjiā yìjiàn yízhì, wǒmen jiù àn zhè gè jìhuà zhíxíng.", "meaning_vi": "Đã là ý kiến mọi người nhất trí rồi thì chúng ta cứ theo kế hoạch này mà thực hiện."},
            {"chinese": "既然答应了别人，就一定要信守承诺。", "pinyin": "Jìrán dāying le biérén, jiù yídìng yào xìnshǒu chéngnuò.", "meaning_vi": "Một khi đã nhận lời người khác thì nhất định phải giữ trọn lời hứa."}
        ]
    },
    {
        "hsk_level": 4,
        "pattern": "无论 / 不管 + Condition, 都 / 也 + Result",
        "title_vi": "Cấu trúc vô điều kiện 无论...都... (Bất luận... đều...)",
        "explanation_vi": "Biểu thị trong bất kỳ tình huống, điều kiện hay hoàn cảnh nào thì kết quả ở vế sau vẫn luôn không đổi.",
        "examples": [
            {"chinese": "无论工作有多忙，他每天都会抽出时间读书。", "pinyin": "Wúlùn gōngzuò yǒu duō máng, tā měitiān dōu huì chōuchū shíjiān dúshū.", "meaning_vi": "Bất luận công việc có bận rộn đến đâu, mỗi ngày anh đều dành thời gian đọc sách."},
            {"chinese": "不管前方的路有多艰难，我们都坚决走下去。", "pinyin": "Bùguǎn qiánfāng de lù yǒu duō jiānnán, wǒmen dōu jiānjué zǒu xiàqù.", "meaning_vi": "Bất kể con đường phía trước có gian nan dường nào, chúng tôi đều kiên quyết bước tiếp."}
        ]
    },
    {
        "hsk_level": 4,
        "pattern": "Verb + 得 / 不 + Complement (Bổ ngữ khả năng)",
        "title_vi": "Bổ ngữ khả năng diễn đạt có thể hay không thể làm được",
        "explanation_vi": "Chèn 得 (khẳng định có thể) hoặc 不 (phủ định không thể) vào giữa động từ và bổ ngữ kết quả/xu hướng.",
        "examples": [
            {"chinese": "老师讲得太快，我听不懂。", "pinyin": "Lǎoshī jiǎng de tài kuài, wǒ tīngbudǒng.", "meaning_vi": "Thầy giáo giảng nhanh quá, tôi nghe không hiểu nổi."},
            {"chinese": "字太小了，我看不清楚。", "pinyin": "Zì tài xiǎo le, wǒ kànbùqīngchu.", "meaning_vi": "Chữ bé quá, tôi nhìn không rõ được."}
        ]
    },
    {
        "hsk_level": 4,
        "pattern": "连 + Extreme Item + 都 / 也 + Verb Phrase",
        "title_vi": "Cấu trúc nhấn mạnh đối tượng 连...都/也... (Ngay cả... cũng...)",
        "explanation_vi": "Dùng 连 để đưa ra một trường hợp cực đoan điển hình nhất nhằm nhấn mạnh tính phổ quát của sự việc.",
        "examples": [
            {"chinese": "这个问题太简单了，连三岁小孩子都知道。", "pinyin": "Zhè gè wèntí tài jiǎndān le, lián sān suì xiǎoháizi dōu zhīdào.", "meaning_vi": "Vấn đề này đơn giản quá, ngay cả đứa bé lên 3 cũng biết."},
            {"chinese": "他忙得连吃午饭的时间都没有。", "pinyin": "Tā máng de lián chī wǔfàn de shíjiān dōu méiyǒu.", "meaning_vi": "Anh ấy bận rộn đến mức ngay cả thời gian ăn bữa trưa cũng không có."}
        ]
    },
    {
        "hsk_level": 4,
        "pattern": "Subject + 究竟 / 到底 + Question Clause？",
        "title_vi": "Phó từ 究竟 / 到底 tăng cường sắc thái truy vấn (Rốt cuộc)",
        "explanation_vi": "Đứng trước từ để hỏi trong câu nghi vấn nhằm nhấn mạnh tâm lý muốn làm sáng tỏ chân tướng sự việc của người nói.",
        "examples": [
            {"chinese": "这件事情的真相究竟是什么？", "pinyin": "Zhè jiàn shìqing de zhēnxiàng jiūjìng shì shénme?", "meaning_vi": "Chân tướng sự việc này rốt cuộc là cái gì?"},
            {"chinese": "你到底想不想跟我们一起去？", "pinyin": "Nǐ dàodǐ xiǎng bù xiǎng gēn wǒmen yìqǐ qù?", "meaning_vi": "Rốt cuộc bạn có muốn đi cùng với chúng tôi hay không?"}
        ]
    },
    {
        "hsk_level": 4,
        "pattern": "按照 + Rule / Standard, Subject + Action",
        "title_vi": "Giới từ 按照 (Căn cứ theo, dựa theo tiêu chuẩn)",
        "explanation_vi": "Dùng để giới thiệu căn cứ, tiêu chuẩn, kế hoạch hoặc quy định làm cơ sở cho hành động.",
        "examples": [
            {"chinese": "我们必须严格按照合同条款执行。", "pinyin": "Wǒmen bìxū yángé ànzhào hétóng tiáokuǎn zhíxíng.", "meaning_vi": "Chúng ta bắt buộc phải thực thi nghiêm ngặt theo các điều khoản hợp đồng."},
            {"chinese": "按照医生的嘱咐，他按时吃药并多休息。", "pinyin": "Ànzhào yīshēng de zhǔfù, tā ànshí chī yào bìng duō xiūxi.", "meaning_vi": "Theo lời dặn của bác sĩ, anh uống thuốc đúng giờ và nghỉ ngơi nhiều."}
        ]
    },

    # ================= HSK 5 =================
    {
        "hsk_level": 5,
        "pattern": "哪怕 + Extreme Scenario, (Subject) + 也 + Result",
        "title_vi": "Cặp liên từ nhượng bộ 哪怕...也... (Cho dù... cũng quyết)",
        "explanation_vi": "Biểu thị quan hệ nhượng bộ giả thiết mạnh mẽ hơn cả 即使, nhấn mạnh quyết tâm hoặc quy luật bất biến dù hoàn cảnh tột cùng khó khăn.",
        "examples": [
            {"chinese": "哪怕前方道路充满荆棘，我们也要勇往直前。", "pinyin": "Nǎpà qiánfāng dàolù chōngmǎn jīngjí, wǒmen yě yào yǒngwǎngzhíqián.", "meaning_vi": "Cho dù con đường phía trước đầy chông gai, chúng ta cũng quyết dũng cảm tiến bước."},
            {"chinese": "哪怕只有百分之一的希望，我们也要尽百分之百的努力。", "pinyin": "Nǎpà zhǐyǒu bǎifēnzhīyī de xīwàng, wǒmen yě yào jìn bǎifēnzhībǎide nǔlì.", "meaning_vi": "Dù chỉ có 1% hy vọng, chúng ta cũng phải dốc trọn 100% nỗ lực."}
        ]
    },
    {
        "hsk_level": 5,
        "pattern": "Action / Cause, 从而 + Inevitable Consequence",
        "title_vi": "Liên từ liên kết 从而 (Từ đó dẫn tới kết quả tất yếu)",
        "explanation_vi": "Dùng ở vế sau để biểu thị hành động hoặc phương pháp ở vế trước là tiền đề trực tiếp dẫn đến kết quả hoặc bước phát triển mới.",
        "examples": [
            {"chinese": "公司全面优化了管理机制，从而大幅提高了运营效率。", "pinyin": "Gōngsī quánmiàn yōuhuà le guǎnlǐ jīzhì, cóng'ér dàfú tígāo le yùnyíng xiàolǜ.", "meaning_vi": "Công ty đã tối ưu hóa toàn diện cơ chế quản lý, từ đó nâng cao đáng kể hiệu suất vận hành."},
            {"chinese": "绿色技术的普及降低了能耗，从而保护了生态环境。", "pinyin": "Lǜsè jìshù de pǔjí jiàngdī le nénghào, cóng'ér bǎohù le shēngtài huánjìng.", "meaning_vi": "Phổ biến công nghệ xanh đã hạ thấp tiêu hao năng lượng, nhờ đó bảo vệ môi trường sinh thái."}
        ]
    },
    {
        "hsk_level": 5,
        "pattern": "鉴于 + Real Condition, Subject + Decision",
        "title_vi": "Giới từ 鉴于 (Xét thấy, căn cứ vào tình hình thực tế)",
        "explanation_vi": "Thường dùng trong văn phong hành chính, học thuật và báo chí để nêu lên lý do, căn cứ xác thực dẫn đến một quyết sách quan trọng.",
        "examples": [
            {"chinese": "鉴于当前天气十分恶劣，组委会决定延期举办户外比赛。", "pinyin": "Jiànyú dāngqián tiānqì shífēn èliè, zǔwěihuì juédìng yánqī jǔbàn hùwài bǐsài.", "meaning_vi": "Xét thấy thời tiết hiện tại vô cùng khắc nghiệt, ban tổ chức quyết định hoãn cuộc thi ngoài trời."},
            {"chinese": "鉴于他在科研领域的杰出贡献，学校授予他终身荣誉教授称号。", "pinyin": "Jiànyú tā zài kēyán lǐngyù de jiéchū gòngxiàn, xuéxiào shòuyǔ tā zhōngshēn róngyù jiàoshòu chēnghào.", "meaning_vi": "Căn cứ vào cống hiến kiệt xuất của ông trong nghiên cứu khoa học, nhà trường đã trao tặng ông danh hiệu giáo sư danh dự trọn đời."}
        ]
    },
    {
        "hsk_level": 5,
        "pattern": "Subject + 由 + Components + 组成 / 构成",
        "title_vi": "Cấu trúc thành phần 由...组成 / 构成 (Được cấu thành từ...)",
        "explanation_vi": "Dùng để phân tích cơ cấu, thành phần cấu tạo nên một thể thống nhất, tổ chức hoặc văn bản.",
        "examples": [
            {"chinese": "这个专家评估委员会由十位资深学者组成。", "pinyin": "Zhè gè zhuānjiā pínggū wěiyuánhuì yóu shí wèi zīshēn xuézhě zǔchéng.", "meaning_vi": "Hội đồng đánh giá chuyên gia này do mười vị học giả thâm niên cấu thành."},
            {"chinese": "水分由氢和氧两种化学元素构成。", "pinyin": "Shuǐfèn yóu qīng hé yǎng liǎng zhǒng huàxué yuánsù gòuchéng.", "meaning_vi": "Nước được cấu tạo từ hai nguyên tố hóa học là hydro và oxy."}
        ]
    },
    {
        "hsk_level": 5,
        "pattern": "以 + Noun 1 + 为 + Noun 2",
        "title_vi": "Cấu trúc 以...为... (Lấy... làm tiêu chuẩn/tôn chỉ)",
        "explanation_vi": "Một cấu trúc Hán ngữ cổ điển rất phổ biến trong văn viết hiện đại, biểu thị xem đối tượng thứ nhất là cốt lõi của hành động.",
        "examples": [
            {"chinese": "现代企业管理应当坚持以人为本的核心理念。", "pinyin": "Xiàndài qǐyè guǎnlǐ yīngdāng jiānchí yǐrénwéiběn de héxīn lǐniàn.", "meaning_vi": "Quản trị doanh nghiệp hiện đại cần kiên trì triết lý cốt lõi lấy con người làm gốc."},
            {"chinese": "我们要以科技创新为动力，推动经济高质量发展。", "pinyin": "Wǒmen yào yǐ kējì chuàngxīn wéi dònglì, tuīdòng jīngjì gāozhìliàng fāzhǎn.", "meaning_vi": "Chúng ta phải lấy đổi mới công nghệ làm động lực để thúc đẩy kinh tế phát triển chất lượng cao."}
        ]
    },
    {
        "hsk_level": 5,
        "pattern": "所谓 + Term, 是指 + Definition",
        "title_vi": "Cấu trúc định nghĩa học thuật 所谓...是指...",
        "explanation_vi": "Dùng trong văn phong thuyết minh, nghiên cứu khoa học để giải thích bản chất khái niệm hoặc thuật ngữ chuyên môn.",
        "examples": [
            {"chinese": "所谓终身学习，是指一个人贯穿一生的自主学习过程。", "pinyin": "Suǒwèi zhōngshēn xuéxí, shì zhǐ yí gè rén guànchuān yìshēng de zìzhǔ xuéxí guòchéng.", "meaning_vi": "Cái gọi là học tập suốt đời chính là chỉ quá trình tự giác học hỏi xuyên suốt cả cuộc đời một con người."},
            {"chinese": "所谓低碳经济，是指以低能耗、低污染为基础的经济模式。", "pinyin": "Suǒwèi dītàn jīngjì, shì zhǐ yǐ dīnénghào, dīwūrǎn wéi jīchǔ de jīngjì móshì.", "meaning_vi": "Cái gọi là nền kinh tế các-bon thấp là chỉ mô hình kinh tế dựa trên mức tiêu hao năng lượng thấp và ít ô nhiễm."}
        ]
    },
    {
        "hsk_level": 5,
        "pattern": "毫无 + Abstract Noun",
        "title_vi": "Cụm định lượng tuyệt đối 毫无 (Không có một chút nào)",
        "explanation_vi": "Dùng trước các danh từ trừu tượng như căn cứ, hy vọng, ý nghĩa, chuẩn bị... để biểu thị sự phủ định hoàn toàn 100%.",
        "examples": [
            {"chinese": "这种未经证实的传言毫无事实根据。", "pinyin": "Zhè zhǒng wèijīng zhèngshí de chuányán háowú shìshí gēnjù.", "meaning_vi": "Lời đồn đoán chưa qua kiểm chứng này hoàn toàn không có một chút căn cứ xác thực nào."},
            {"chinese": "在毫无防备的情况下遭遇了突如其来的变故。", "pinyin": "Zài háowú fángbèi de qíngkuàng xià zāoyù le tūrúqílái de biàngù.", "meaning_vi": "Dưới tình thế hoàn toàn không có sự phòng bị nào đã bất ngờ gặp phải biến cố ập đến."}
        ]
    },
    {
        "hsk_level": 5,
        "pattern": "与其 + Option A (disfavored), 不如 + Option B (favored)",
        "title_vi": "Cặp liên từ so sánh lựa chọn 与其...不如... (Thà... còn hơn...)",
        "explanation_vi": "So sánh giữa hai phương án khả thi, người nói dứt khoát nghiêng về phương án B sau khi cân nhắc thiệt hơn với A.",
        "examples": [
            {"chinese": "与其在这里无休止地抱怨，不如立刻采取实际行动。", "pinyin": "Yǔqí zài zhèlǐ wúxiūzhǐ de bàoyuàn, bùrú lìkè cǎiqǔ shíjì xíngdòng.", "meaning_vi": "Thà bắt tay ngay vào hành động thực tế còn hơn là ngồi đây than vãn không dứt."},
            {"chinese": "与其临渴掘井，不如平时未雨绸缪。", "pinyin": "Yǔqí lín kě jué jǐng, bùrú píngshí wèiyǔchóumóu.", "meaning_vi": "Thà bình thường biết lo xa phòng ngừa, còn hơn nước đến chân mới nhảy (khát mới đào giếng)."}
        ]
    },

    # ================= HSK 6 =================
    {
        "hsk_level": 6,
        "pattern": "毋庸置疑 / 不容置疑, + Proposition",
        "title_vi": "Cấu trúc khẳng định tuyệt đối 毋庸置疑 (Không cần phải hoài nghi)",
        "explanation_vi": "Văn phong học thuật và bình luận cao cấp khẳng định một chân lý hoặc tiền đề chắc chắn đến mức không ai có thể phủ nhận.",
        "examples": [
            {"chinese": "毋庸置疑，创新已成为推动人类文明进步的根本动力。", "pinyin": "Wúyōngzhìyí, chuàngxīn yǐ chéngwéi tuīdòng rénlèi wénmíng jìnbù de gēnběn dònglì.", "meaning_vi": "Không cần phải hoài nghi, sáng tạo đổi mới đã trở thành động lực căn bản thúc đẩy nền văn minh nhân loại tiến bộ."},
            {"chinese": "保护知识产权对营造良好商业环境的重要性是不容置疑的。", "pinyin": "Bǎohù zhīshi chǎnquán duì yíngzào liánghǎo shāngyè huánjìng de zhòngyàoxìng shì bùróngzhìyí de.", "meaning_vi": "Tầm quan trọng của việc bảo vệ quyền sở hữu trí tuệ đối với việc tạo dựng môi trường kinh doanh lành mạnh là điều không thể nghi ngờ."}
        ]
    },
    {
        "hsk_level": 6,
        "pattern": "Condition / Action, 势必 + Inevitable Trend",
        "title_vi": "Phó từ chỉ xu thế tất yếu 势必 (Ắt hẳn sẽ, chắc chắn sẽ kéo theo)",
        "explanation_vi": "Chỉ ra một chiều hướng hoặc hậu quả lớn tất yếu không thể đảo ngược bắt nguồn từ xu thế khách quan.",
        "examples": [
            {"chinese": "如果不及时遏制生态恶化，势必给子孙后代带来不可逆转的灾难。", "pinyin": "Rúguǒ bù jíshí èzhì shēngtài èhuà, shìbì gěi zǐsūn hòudài dàilái bùkě nìzhuǎn de zāinàn.", "meaning_vi": "Nếu không kịp thời ngăn chặn sự suy thoái sinh thái, ắt hẳn sẽ mang lại thảm họa khôn lường cho con cháu mai sau."},
            {"chinese": "两家巨头企业的强强联合，势必彻底重塑整个行业竞争版图。", "pinyin": "Liǎng jiā jùtóu qǐyè de qiángqiáng liánhé, shìbì chèdǐ chóngsù zhěng gè hángyè jìngzhēng bǎntú.", "meaning_vi": "Sự liên minh giữa hai doanh nghiệp đầu ngành ắt hẳn sẽ tái định hình triệt để bức tranh cạnh tranh toàn ngành."}
        ]
    },
    {
        "hsk_level": 6,
        "pattern": "Premise Context, 有鉴于此, + Strategic Measure",
        "title_vi": "Cụm liên từ tư duy chiến lược 有鉴于此 (Trước thực tế nêu trên...)",
        "explanation_vi": "Dùng ở đầu đoạn văn nghị luận để nối kết tình hình phân tích ở trên với chuỗi giải pháp chiến lược then chốt đưa ra ngay sau đó.",
        "examples": [
            {"chinese": "当前国际环境错综复杂。有鉴于此，我国必须加快构建新发展格局。", "pinyin": "Dāngqián guójì huánjìng cuòzōngfùzá. Yǒujiànyúcǐ, wǒguó bìxū jiākuài gòujiàn xīn fāzhǎn gújú.", "meaning_vi": "Môi trường quốc tế hiện nay đan xen phức tạp. Trước thực tế đó, nước ta bắt buộc phải đẩy nhanh kiến tạo cục diện phát triển mới."},
            {"chinese": "传统销售模式增长乏力。有鉴于此，企业全面启动了数字化全渠道战略。", "pinyin": "Chuántǒng xiāoshòu móshì zēngzhǎng fálì. Yǒujiànyúcǐ, qǐyè quánmiàn qǐdòng le shùzìhuà quán qúdào zhànlüè.", "meaning_vi": "Mô hình bán hàng truyền thống tăng trưởng đuối sức. Nhận thức rõ điều này, doanh nghiệp đã khởi động toàn diện chiến lược đa kênh số hóa."}
        ]
    },
    {
        "hsk_level": 6,
        "pattern": "虽 + Apparent Feature, 但究其根本 + Root Cause",
        "title_vi": "Cấu trúc biện chứng 虽...但究其根本 (Tuy bề ngoài... nhưng xét đến tận cùng)",
        "explanation_vi": "Dùng để lột trần bản chất đằng sau vẻ bề ngoài, đưa tư duy phân tích đạt tầm triết học sâu sắc.",
        "examples": [
            {"chinese": "双方虽在具体操作细节上存在分歧，但究其根本，共同的利益追求远大于分歧。", "pinyin": "Shuāngfāng suī zài jùtǐ cāozuò xìjié shang cúnzài fēnqí, dàn jiù qí gēnběn, gòngtóng de lìyì zhuīqiú yuǎn dàyú fēnqí.", "meaning_vi": "Hai bên tuy có bất đồng ở chi tiết vận hành cụ thể, nhưng xét đến tận cùng, mục tiêu lợi ích chung lớn hơn nhiều so với bất đồng."},
            {"chinese": "现代人表现出的种种焦虑，虽形态各异，但究其根本，多源于对未来的不确定感。", "pinyin": "Xiàndài rén biǎoxiàn chū de zhǒngzhǒng jiāolǜ, suī xíngtài gèyì, dàn jiù qí gēnběn, duō yuányú duì wèilái de búquèdìnggǎn.", "meaning_vi": "Những nỗi âu lo muôn vẻ của con người hiện đại, tuy muôn hình vạn trạng, nhưng xét đến tận cùng, phần lớn bắt nguồn từ cảm giác bất an trước tương lai."}
        ]
    },
    {
        "hsk_level": 6,
        "pattern": "透过 + Phenomenon, 进而 + Essence / Deep Truth",
        "title_vi": "Cấu trúc thấu thị bản chất 透过...进而... (Xuyên qua hiện tượng để thấy bản chất)",
        "explanation_vi": "Biểu thị quá trình nhận thức từ cái cụ thể bên ngoài đi sâu vào quy luật trừu tượng cốt lõi bên trong.",
        "examples": [
            {"chinese": "学者善于透过纷繁复杂的历史现象，进而揭示社会演进的内在逻辑。", "pinyin": "Xuézhě shànyú tòuguò fēnfán fùzá de lìshǐ xiànxiàng, jìn'ér jiēshì shèhuì yǎnjìn de nèizài luóji.", "meaning_vi": "Học giả giỏi xuyên qua các hiện tượng lịch sử bề bộn phức tạp, từ đó vạch trần lô-gích nội tại của sự tiến hóa xã hội."},
            {"chinese": "透过波动的市场价格走势，进而把握宏观供需关系的深刻变动。", "pinyin": "Tòuguò bōdòng de shìchǎng jiàgé zǒushì, jìn'ér bǎowò hóngguān gōngxū guānxi de shēnkè biàndòng.", "meaning_vi": "Xuyên qua xu hướng dao động giá cả thị trường, từ đó nắm bắt biến động sâu sắc của quan hệ cung cầu vĩ mô."}
        ]
    },
    {
        "hsk_level": 6,
        "pattern": "秉承 / 遵循 + Principle, (Subject) + Action",
        "title_vi": "Cấu trúc phong thái 秉承...理念 (Kế thừa và phát huy tôn chỉ/nguyên tắc)",
        "explanation_vi": "Dùng trong tuyên ngôn sứ mệnh, văn hóa doanh nghiệp hoặc học thuyết để biểu thị sự trung thành giữ gìn giá trị cao quý.",
        "examples": [
            {"chinese": "大学始终秉承'厚德载物、自强不息'的校训精神，培育栋梁之才。", "pinyin": "Dàxué shǐzhōng bǐngchéng 'hòudézàiwù, zìqiángbùxī' de xiàoxùn jīngshén, péiyù dòngliáng zhī cái.", "meaning_vi": "Trường đại học luôn kế thừa phát huy tinh thần 'Hậu đức tải vật, tự cường bất tức' để bồi dưỡng nhân tài rường cột."},
            {"chinese": "我们遵循相互尊重、平等互利的原则开展广泛的国际经贸合作。", "pinyin": "Wǒmen zūnxún xiānghù zūnzhòng, píngděng hùlì de yuánzé kāizhǎn guǎngfàn de guójì jīngmào hézuò.", "meaning_vi": "Chúng tôi tuân theo nguyên tắc tôn trọng lẫn nhau, bình đẳng cùng có lợi để triển khai hợp tác kinh tế thương mại quốc tế sâu rộng."}
        ]
    },
    {
        "hsk_level": 6,
        "pattern": "Work / Object + 寄托 / 蕴含着 + Deep Sentiment / Philosophy",
        "title_vi": "Cấu trúc hàm ẩn tư tưởng 寄托 / 蕴含着 (Gửi gắm/chứa đựng thông điệp sâu xa)",
        "explanation_vi": "Dùng trong phê bình văn học nghệ thuật, phân tích di sản văn hóa nhằm tôn vinh giá trị tinh thần tiềm ẩn bên trong tác phẩm.",
        "examples": [
            {"chinese": "这件传世的青铜重器寄托着古人对天地神明的敬畏与虔诚祈愿。", "pinyin": "Zhè jiàn chuánshì de qīngtóng zhòngqì jìtuō zhe gǔrén duì tiāndì shénmíng de jìngwèi yǔ qiánchéng qíyuàn.", "meaning_vi": "Bảo vật đồ đồng cổ truyền đời này gửi gắm lòng kính sợ và lời cầu nguyện chí thành của tiền nhân đối với đất trời thần linh."},
            {"chinese": "质朴的诗句中蕴含着诗人对故土家园无限深沉的眷恋之情。", "pinyin": "Zhìpǔ de shījù zhōng yùnhán zhe shīrén duì gùtǔ jiāyuán wúxiàn shēnchén de juànliàn zhī qíng.", "meaning_vi": "Trong câu thơ mộc mạc ẩn chứa tình cảm quyến luyến vô bờ bến và sâu nặng của thi nhân đối với mảnh đất quê cha đất tổ."}
        ]
    },
    {
        "hsk_level": 6,
        "pattern": "兼容并蓄，从而 + Reach Sublime State",
        "title_vi": "Cấu trúc bao dung văn hóa 兼容并蓄 (Dung hòa tinh hoa đa dạng để bứt phá)",
        "explanation_vi": "Biểu thị phẩm chất dung nạp mọi luồng tư tưởng, học thuyết và tinh hoa khác biệt để đúc kết thành tầm vóc vĩ đại mới.",
        "examples": [
            {"chinese": "学者博采众长、兼容并蓄，从而创立了独树一帜的全新学术流派。", "pinyin": "Xuézhě bócǎizhòngcháng, jiānróngbìngxù, cóng'ér chuànglì le dúshùyízhì de quánxīn xuéshù liúpài.", "meaning_vi": "Bậc học giả tiếp thu rộng rãi sở trường của muôn nhà, dung hòa tinh hoa, từ đó sáng lập nên trường phái học thuật hoàn toàn mới độc nhất vô nhị."},
            {"chinese": "一座真正伟大的城市应当兼收并蓄，海纳百川，展现多元文化的共生之美。", "pinyin": "Yí zuò zhēnzhèng wěidà de chéngshì yīngdāng jiānshōubìngxù, hǎinàbǎichuān, zhǎnxiàn duōyuán wénhuà de gòngshēng zhī měi.", "meaning_vi": "Một thành phố thực sự vĩ đại cần biết bao dung thu nạp, trăm sông đổ về một biển, thể hiện vẻ đẹp cộng sinh của nền văn hóa đa nguyên."}
        ]
    }
]

if __name__ == "__main__":
    print(f"Total Grammar Points: {len(GRAMMAR_DATA)}")
    counts = {}
    for g in GRAMMAR_DATA:
        lvl = g["hsk_level"]
        counts[lvl] = counts.get(lvl, 0) + 1
    print("Counts by level:", counts)
