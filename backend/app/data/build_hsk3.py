import pprint

HSK3_RAW = [
    # Actions & Problem Solving
    ("解决", "解決", "jiějué", "jie jue", "giải quyết", "Giải quyết (vấn đề)", "To solve, resolve", "Động từ", 19, [("这个问题很容易解决。", "Zhè gè wèntí hěn róngyì jiějué.", "Vấn đề này rất dễ giải quyết.", "This problem is easy to solve.")]),
    ("提高", "提高", "tígāo", "ti gao", "đề cao", "Nâng cao, cải thiện", "To improve, raise", "Động từ", 22, [("多听多说能提高听力水平。", "Duō tīng duō shuō néng tígāo tīnglì shuǐpíng.", "Nghe nhiều nói nhiều giúp nâng cao khả năng nghe.", "Listening and speaking more improves listening level.")]),
    ("习惯", "習慣", "xíguàn", "xi guan", "tập quán", "Thói quen, quen với", "Habit, to be used to", "Động từ / Danh từ", 14, [("早睡早起是个好习惯。", "Zǎoshuì zǎoqǐ shì gè hǎo xíguàn.", "Ngủ sớm dậy sớm là một thói quen tốt.", "Sleeping early and waking early is a good habit.")]),
    ("照顾", "照顧", "zhàogù", "zhao gu", "chiếu cố", "Chăm sóc, trông nom", "To take care of, look after", "Động từ", 28, [("妈妈生病了，我要照顾她。", "Māma shēngbìng le, wǒ yào zhàogù tā.", "Mẹ bị ốm rồi, tôi cần chăm sóc mẹ.", "Mom is sick, I need to take care of her.")]),
    ("检查", "檢查", "jiǎnchá", "jian cha", "kiểm tra", "Kiểm tra, khám bệnh", "To examine, check", "Động từ / Danh từ", 20, [("考试后要仔细检查一遍。", "Kǎoshì hòu yào zǐxì jiǎnchá yí biàn.", "Sau khi làm bài thi phải kiểm tra kỹ một lượt.", "Check carefully after the exam.")]),
    ("练习", "練習", "liànxí", "lian xi", "luyện tập", "Luyện tập, bài luyện tập", "To practice, exercise", "Động từ / Danh từ", 19, [("每天坚持练习写汉字。", "Měitiān jiānchí liànxí xiě Hànzì.", "Mỗi ngày kiên trì luyện viết chữ Hán.", "Practice writing Chinese characters persistently every day.")]),
    ("选择", "選擇", "xuǎnzé", "xuan ze", "tuyển trạch", "Lựa chọn, sự lựa chọn", "To choose, select", "Động từ / Danh từ", 23, [("这是最好的选择。", "Zhè shì zuì hǎo de xuǎnzé.", "Đây là sự lựa chọn tốt nhất.", "This is the best choice.")]),
    ("发现", "發現", "fāxiàn", "fa xian", "phát hiện", "Phát hiện, nhận ra", "To discover, find out", "Động từ", 16, [("我发现他今天心情很好。", "Wǒ fāxiàn tā jīntiān xīinqíng hěn hǎo.", "Tôi phát hiện hôm nay tâm trạng anh ấy rất tốt.", "I discovered he is in a great mood today.")]),
    ("相信", "相信", "xiāngxìn", "xiang xin", "tương tín", "Tin tưởng, tin cậy", "To believe, trust", "Động từ", 18, [("我相信你一定能做到。", "Wǒ xiāngxìn nǐ yídìng néng zuò dào.", "Tôi tin bạn nhất định có thể làm được.", "I believe you can definitely do it.")]),
    ("同意", "同意", "tóngyì", "tong yi", "đồng ý", "Đồng ý, tán thành", "To agree", "Động từ", 19, [("大家都很同意这个方案。", "Dàjiā dōu hěn tóngyì zhè gè fāng'àn.", "Mọi người đều rất đồng ý với phương án này.", "Everyone agrees with this plan.")]),
    ("影响", "影響", "yǐngxiǎng", "ying xiang", "ảnh hưởng", "Ảnh hưởng, tác động", "To influence, effect", "Động từ / Danh từ", 27, [("环境对人的影响很大。", "Huánjìng duì rén de yǐngxiǎng hěn dà.", "Môi trường có ảnh hưởng rất lớn đến con người.", "Environment has a big influence on people.")]),
    ("要求", "要求", "yāoqiú", "yao qiu", "yêu cầu", "Yêu cầu, đòi hỏi", "To demand, requirement", "Động từ / Danh từ", 16, [("老师对我们要求很严格。", "Lǎoshī duì wǒmen yāoqiú hěn yángé.", "Thầy giáo có yêu cầu rất nghiêm khắc với chúng tôi.", "The teacher has strict requirements for us.")]),
    ("遇到", "遇到", "yùdào", "yu dao", "ngộ đáo", "Gặp phải, bắt gặp", "To encounter, meet", "Động từ", 17, [("遇到困难不要放弃。", "Yùdào kùnnán bú yào fàngqì.", "Gặp phải khó khăn chớ từ bỏ.", "Do not give up when encountering difficulties.")]),
    ("记得", "記得", "jìde", "ji de", "ký đắc", "Nhớ, còn nhớ", "To remember", "Động từ", 20, [("你还记得他的名字吗？", "Nǐ hái jìde tā de míngzi ma?", "Bạn còn nhớ tên anh ấy không?", "Do you still remember his name?")]),
    ("忘记", "忘記", "wàngjì", "wang ji", "vong ký", "Quên, lãng quên", "To forget", "Động từ", 13, [("千万别忘记带护照。", "Qiānwàn bié wàngjì dài hùzhào.", "Nhất định đừng quên mang theo hộ chiếu.", "Never forget to bring your passport.")]),
    ("参加", "參加", "cānjiā", "can gia", "tham gia", "Tham gia, tham dự", "To participate, join", "Động từ", 13, [("我们都要参加这次会议。", "Wǒmen dōu yào cānjiā zhè cì huìyì.", "Tất cả chúng tôi đều phải tham gia cuộc họp lần này.", "We all need to participate in this meeting.")]),
    ("离开", "離開", "líkāi", "li kai", "ly khai", "Rời khỏi, xa rời", "To leave, depart", "Động từ", 14, [("他昨天离开了北京。", "Tā zuótiān líkāi le Běijīng.", "Hôm qua anh ấy đã rời khỏi Bắc Kinh.", "He left Beijing yesterday.")]),
    ("迟到", "遲到", "chídào", "chi dao", "trì đáo", "Đến muộn, đi trễ", "To be late", "Động từ", 20, [("今天路上堵车，我迟到了。", "Jīntiān lù shang dǔchē, wǒ chídào le.", "Hôm nay trên đường tắc xe, tôi đến muộn rồi.", "Traffic jam on the road today, I was late.")]),
    ("借", "借", "jiè", "jie", "tá", "Mượn, vay", "To borrow, lend", "Động từ", 10, [("我想借一本汉语书。", "Wǒ xiǎng jiè yì běn Hànyǔ shū.", "Tôi muốn mượn một quyển sách tiếng Trung.", "I want to borrow a Chinese book.")]),
    ("还", "還", "huán", "huan", "hoàn", "Trả lại, hoàn trả", "To return (something)", "Động từ", 7, [("借的书下周要还。", "Jiè de shū xià zhōu yào huán.", "Sách mượn tuần sau phải trả.", "Borrowed books must be returned next week.")]),
    ("敢", "敢", "gǎn", "gan", "cảm", "Dám", "To dare", "Động từ năng nguyện", 11, [("你敢一个人去吗？", "Nǐ gǎn yí gè rén qù ma?", "Bạn dám một mình đi không?", "Do you dare to go alone?")]),
    ("换", "換", "huàn", "huan", "hoán", "Đổi, thay đổi", "To change, exchange", "Động từ", 12, [("我想换一些人民币。", "Wǒ xiǎng huàn yìxiē rénmínbì.", "Tôi muốn đổi một ít đồng nhân dân tệ.", "I want to exchange some RMB.")]),
    ("骑", "騎", "qí", "qi", "kỵ", "Cưỡi, đi (xe đạp, xe máy)", "To ride (bike, horse)", "Động từ", 11, [("骑自行车既健康又环保。", "Qí zìxíngchē jì jiànkāng yòu huánbǎo.", "Đi xe đạp vừa khỏe vừa bảo vệ môi trường.", "Riding a bicycle is both healthy and eco-friendly.")]),
    ("打算", "打算", "dǎsuàn", "da suan", "đả toán", "Dự định, kế hoạch", "To plan, intend", "Động từ / Danh từ", 19, [("暑假你打算做什么？", "Shǔjià nǐ dǎsuàn zuò shénme?", "Nghỉ hè bạn dự định làm gì?", "What do you plan to do during summer vacation?")]),
    ("结束", "結束", "jiéshù", "jie shu", "kết thúc", "Kết thúc, chấm dứt", "To finish, end", "Động từ", 22, [("比赛终于结束了。", "Bǐsài zhōngyú jiéshù le.", "Trận đấu rốt cuộc đã kết thúc rồi.", "The match finally ended.")]),
    ("放心", "放心", "fàngxīn", "fang xin", "phóng tâm", "Yên tâm, an tâm", "To feel relieved, rest assured", "Động từ", 12, [("你放心吧，事情办好了。", "Nǐ fàngxīn ba, shìqing bànhǎo le.", "Bạn yên tâm đi, việc đã làm xong xuôi rồi.", "Rest assured, everything is taken care of.")]),
    ("担心", "擔心", "dānxīn", "dan xin", "đam tâm", "Lo lắng, lo ngại", "To worry", "Động từ", 13, [("别担心，一切都会好起来的。", "Bié dānxīn, yíqiè dōu huì hǎo qǐlái de.", "Đừng lo, mọi chuyện rồi sẽ tốt lên thôi.", "Don't worry, everything will be fine.")]),
    ("关心", "關心", "guānxīn", "guan xin", "quan tâm", "Quan tâm, săn sóc", "To care about, concern", "Động từ", 10, [("谢谢大家对我的关心。", "Xièxie dàjiā duì wǒ de guānxīn.", "Cảm ơn sự quan tâm của mọi người dành cho tôi.", "Thank you all for your care toward me.")]),
    ("害怕", "害怕", "hàipà", "hai pa", "hại phạ", "Sợ hãi, sợ", "To be afraid, scared", "Động từ", 17, [("她很害怕独自在黑暗中。", "Tā hěn hàipà dúzì zài hēi'àn zhōng.", "Cô ấy rất sợ một mình trong bóng tối.", "She is scared of being alone in the dark.")]),
    ("认为", "認為", "rènwéi", "ren wei", "nhận vi", "Cho rằng, nghĩ rằng (chính kiến)", "To think, consider", "Động từ", 8, [("我认为这个方法可行。", "Wǒ rènwéi zhè gè fāngfǎ kěxíng.", "Tôi cho rằng phương pháp này khả thi.", "I think this method is feasible.")]),
    ("以为", "以為", "yǐwéi", "yi wei", "dĩ vi", "Tưởng là (thực tế ngược lại)", "To think mistakenly", "Động từ", 8, [("我以为今天是星期六呢。", "Wǒ yǐwéi jīntiān shì xīngqīliù ne.", "Tôi cứ tưởng hôm nay là thứ Bảy chứ.", "I mistakenly thought today was Saturday.")]),
    ("明白", "明白", "míngbai", "ming bai", "minh bạch", "Hiểu rõ, rõ ràng", "To understand, clear", "Động từ / Tính từ", 13, [("这道题的答案我已经明白了。", "Zhè dào tí de dá'àn wǒ yǐjīng míngbai le.", "Đáp án câu này tôi đã hiểu rõ rồi.", "I already understand the answer to this question.")]),
    ("了解", "瞭解", "liǎojiě", "liao jie", "liễu giải", "Am hiểu, tìm hiểu tường tận", "To understand deeply", "Động từ", 15, [("我想多了解中国文化。", "Wǒ xiǎng duō liǎojiě Zhōngguó wénhuà.", "Tôi muốn tìm hiểu sâu hơn về văn hóa Trung Hoa.", "I want to understand Chinese culture more deeply.")]),
    ("祝贺", "祝賀", "zhùhè", "zhu he", "chúc hạ", "Chúc mừng", "To congratulate", "Động từ", 21, [("祝贺你顺利通过考试！", "Zhùhè nǐ shùnlì tōngguò kǎoshì!", "Chúc mừng bạn thuận lợi vượt qua kỳ thi!", "Congratulations on passing the exam smoothly!")]),
    ("欢迎", "歡迎", "huānyíng", "huan ying", "hoan nghênh", "Hoan nghênh, chào đón", "To welcome", "Động từ", 17, [("热烈欢迎新同学！", "Rèliè huānyíng xīn tóngxué!", "Nhiệt liệt chào đón các bạn học mới!", "Warmly welcome new classmates!")]),
    
    # Traits, States & Feelings
    ("简单", "簡單", "jiǎndān", "jian dan", "giản đơn", "Đơn giản, dễ dàng", "Simple, easy", "Tính từ", 21, [("这个问题其实很简单。", "Zhè gè wèntí qíshí hěn jiǎndān.", "Vấn đề này thực ra rất đơn giản.", "This problem is actually very simple.")]),
    ("难", "難", "nán", "nan", "nan", "Khó, gian nan", "Difficult, hard", "Tính từ", 10, [("写汉字对他来说有点难。", "Xiě Hànzì duì tā láishuō yǒudiǎnr nán.", "Viết chữ Hán đối với cậu ấy hơi khó một chút.", "Writing Chinese characters is a bit hard for him.")]),
    ("热情", "熱情", "rèqíng", "re qing", "nhiệt tình", "Nhiệt tình, niềm nở", "Enthusiastic, warm", "Tính từ", 21, [("中国人非常热情好客。", "Zhōngguó rén fēicháng rèqíng hàokè.", "Người Trung Quốc rất nhiệt tình mến khách.", "Chinese people are very enthusiastic and hospitable.")]),
    ("认真", "認真", "rènzhēn", "ren zhen", "nhận chân", "Chăm chỉ, nghiêm túc", "Conscientious, serious", "Tính từ", 14, [("他学习一向非常认真。", "Tā xuéxí yíxiàng fēicháng rènzhēn.", "Cậu ấy học tập xưa nay đều rất chăm chỉ.", "He has always been very diligent in studying.")]),
    ("奇怪", "奇怪", "qíguài", "qi guai", "kỳ quái", "Kỳ lạ, quái lạ", "Strange, odd", "Tính từ", 16, [("这件事情真奇怪。", "Zhè jiàn shìqing zhēn qíguài.", "Chuyện này thật là kỳ lạ.", "This matter is really strange.")]),
    ("清楚", "清楚", "qīngchu", "qing chu", "thanh sở", "Rõ ràng, rành mạch", "Clear, distinct", "Tính từ", 24, [("黑板上的字看得很清楚。", "Hēibǎn shang de zì kàn de hěn qīngchu.", "Chữ trên bảng nhìn rất rõ ràng.", "The characters on the blackboard can be seen clearly.")]),
    ("聪明", "聰明", "cōngming", "cong ming", "thông minh", "Thông minh, lanh lợi", "Smart, clever", "Tính từ", 23, [("这个小男孩非常聪明。", "Zhè gè xiǎonánhái fēicháng cōngming.", "Cậu bé này vô cùng thông minh.", "This little boy is very smart.")]),
    ("努力", "努力", "nǔlì", "nu li", "nỗ lực", "Chăm chỉ, nỗ lực cố gắng", "Hardworking, effort", "Tính từ / Động từ", 9, [("只要努力，就一定能成功。", "Zhǐyào nǔlì, jiù yídìng néng chénggōng.", "Chỉ cần nỗ lực, nhất định có thể thành công.", "As long as you work hard, you will surely succeed.")]),
    ("方便", "方便", "fāngbiàn", "fang bian", "phương tiện", "Thuận tiện, tiện lợi", "Convenient", "Tính từ", 13, [("坐地铁出行非常方便。", "Zuò dìtiě chūxíng fēicháng fāngbiàn.", "Đi lại bằng tàu điện ngầm rất tiện lợi.", "Taking the subway is very convenient.")]),
    ("安静", "安靜", "ānjìng", "an jing", "an tĩnh", "Yên tĩnh, thanh tịnh", "Quiet, peaceful", "Tính từ", 20, [("阅览室里请保持安静。", "Yuèlǎnshì lǐ qǐng bǎochí ānjìng.", "Trong phòng đọc xin hãy giữ yên tĩnh.", "Please keep quiet in the reading room.")]),
    ("舒服", "舒服", "shūfu", "shu fu", "thư phục", "Thoải mái, dễ chịu", "Comfortable", "Tính từ", 20, [("躺在沙发上真舒服。", "Tǎng zài shāfā shang zhēn shūfu.", "Nằm trên sofa thật thoải mái.", "Lying on the sofa is really comfortable.")]),
    ("着急", "著急", "zháojí", "zhao ji", "trước cấp", "Sốt ruột, nôn nóng", "Anxious, worried", "Tính từ", 17, [("别着急，我们还有时间。", "Bié zháojí, wǒmen hái yǒu shíjiān.", "Đừng sốt ruột, chúng ta vẫn còn thời gian.", "Don't be anxious, we still have time.")]),
    ("满意", "滿意", "mǎnyì", "man yi", "mãn ý", "Hài lòng, vừa ý", "Satisfied, pleased", "Tính từ", 18, [("老板对他的表现很满意。", "Lǎobǎn duì tā de biǎoxiàn hěn mǎnyì.", "Ông chủ rất hài lòng với biểu hiện của anh ấy.", "The boss is very satisfied with his performance.")]),
    ("渴", "渴", "kě", "ke", "khát", "Khát nước", "Thirsty", "Tính từ", 12, [("走了这么久，我很渴。", "Zǒu le zhème jiǔ, wǒ hěn kě.", "Đi bộ lâu như vậy, tôi rất khát nước.", "Walked for so long, I am very thirsty.")]),
    ("饱", "飽", "bǎo", "bao", "bão", "No (bụng)", "Full (after eating)", "Tính từ", 13, [("我吃饱了，吃不下了。", "Wǒ chī bǎo le, chī bú xià le.", "Tôi no rồi, không ăn thêm được nữa.", "I am full, cannot eat anymore.")]),
    ("饿", "餓", "è", "e", "ngạ", "Đói bụng", "Hungry", "Tính từ", 15, [("肚子饿了，想吃碗面。", "Dùzi è le, xiǎng chī wǎn miàn.", "Bụng đói rồi, muốn ăn một bát mì.", "Stomach is hungry, want to eat a bowl of noodles.")]),
    ("甜", "甜", "tián", "tian", "điềm", "Ngọt", "Sweet", "Tính từ", 11, [("这个西瓜真甜！", "Zhè gè xīguā zhēn tián!", "Quả dưa hấu này ngọt thật!", "This watermelon is really sweet!")]),
    ("酸", "酸", "suān", "suan", "toan", "Chua, mỏi", "Sour, sore", "Tính từ", 14, [("柠檬的味道很酸。", "Níngméng de wèidào hěn suān.", "Hương vị của quả chanh rất chua.", "The taste of lemon is very sour.")]),
    ("新鲜", "新鮮", "xīnxiān", "xin xian", "tân tiên", "Tươi mới, trong lành", "Fresh", "Tính từ", 28, [("菜市场的水果都很新鲜。", "Càishìchǎng de shuǐguǒ dōu hěn xīnxiān.", "Trái cây ở chợ rau đều rất tươi ngon.", "Fruit at the vegetable market is very fresh.")]),
    ("干净", "乾淨", "gānjìng", "gan jing", "can tịnh", "Sạch sẽ", "Clean", "Tính từ", 14, [("房间收拾得真干净。", "Fángjiān shōushi de zhēn gānjìng.", "Căn phòng dọn dẹp thật sạch sẽ.", "The room was tidied up very clean.")]),
    ("瘦", "瘦", "shòu", "shou", "sấu", "Gầy, ốm", "Thin, skinny", "Tính từ", 14, [("他最近锻炼变瘦了。", "Tā zuìjìn duànliàn biàn shòu le.", "Dạo này anh ấy tập luyện nên gầy đi rồi.", "He exercised recently and got thinner.")]),
    ("胖", "胖", "pàng", "pang", "bàng", "Béo, mập", "Fat, plump", "Tính từ", 9, [("小猫吃得胖乎乎的。", "Xiǎomāo chī de pànghūhū de.", "Mèo con ăn đến béo múp míp.", "The kitten ate and became chubby.")]),
    ("年轻", "年輕", "niánqīng", "nian qing", "niên khinh", "Trẻ tuổi, thanh xuân", "Young", "Tính từ", 18, [("年轻人要多勇于尝试。", "Niánqīngrén yào duō yǒngyú chángshì.", "Người trẻ tuổi cần dũng cảm thử sức.", "Young people should dare to try more.")]),
    ("矮", "矮", "ǎi", "ai", "oải", "Thấp, lùn", "Short (height)", "Tính từ", 13, [("弟弟比哥哥矮半个头。", "Dìdi bǐ gēge ǎi bàn gè tóu.", "Em trai thấp hơn anh trai nửa cái đầu.", "Younger brother is half a head shorter than older brother.")]),
    
    # Adverbs & Grammar Connectors
    ("几乎", "幾乎", "jīhū", "ji hu", "cơ hồ", "Gần như, hầu như", "Almost, nearly", "Phó từ", 17, [("我几乎每天都去图书馆。", "Wǒ jīhū měitiān dōu qù túshūguǎn.", "Tôi gần như ngày nào cũng đến thư viện.", "I go to the library almost every day.")]),
    ("经常", "經常", "jīngcháng", "jing chang", "kinh thường", "Thường xuyên, hay", "Often, frequently", "Phó từ", 19, [("他经常去公园散步。", "Tā jīngcháng qù gōngyuán sànbù.", "Anh ấy thường xuyên đi dạo trong công viên.", "He often goes for walks in the park.")]),
    ("突然", "突然", "tūrán", "tu ran", "đột nhiên", "Đột nhiên, bất ngờ", "Suddenly, abrupt", "Phó từ / Tính từ", 20, [("天空突然下起了大雨。", "Tiānkōng tūrán xiàqǐ le dàyǔ.", "Bầu trời đột nhiên đổ mưa rào.", "Rain suddenly started pouring from the sky.")]),
    ("愿意", "願意", "yuànyì", "yuan yi", "nguyện ý", "Sẵn lòng, bằng lòng", "Willing to", "Động từ năng nguyện", 24, [("你愿意跟我一起去吗？", "Nǐ yuànyì gēn wǒ yìqǐ qù ma?", "Bạn có sẵn lòng đi cùng tôi không?", "Are you willing to go with me?")]),
    ("终于", "終於", "zhōngyú", "zhong yu", "chung vu", "Rốt cuộc, cuối cùng cũng", "Finally, at last", "Phó từ", 14, [("经过努力，他终于成功了。", "Jīngguò nǔlì, tā zhōngyú chénggōng le.", "Qua nỗ lực, anh ấy cuối cùng cũng đã thành công.", "Through hard work, he finally succeeded.")]),
    ("其实", "其實", "qíshí", "qi shi", "kỳ thực", "Kỳ thực, thật ra", "Actually, in fact", "Phó từ", 16, [("他表面严肃，其实很幽默。", "Tā biǎomiàn yánsù, qíshí hěn yōumò.", "Bề ngoài anh ấy nghiêm nghị, thật ra rất hài hước.", "He looks stern on the outside, but is actually humorous.")]),
    ("互相", "互相", "hùxiāng", "hu xiang", "hỗ tương", "Lẫn nhau, tương hỗ", "Each other, mutually", "Phó từ", 13, [("同学们应该互相帮助。", "Tóngxuémen yīnggāi hùxiāng bāngzhù.", "Các bạn học nên giúp đỡ lẫn nhau.", "Classmates should help each other.")]),
    ("马上", "馬上", "mǎshàng", "ma shang", "mã thượng", "Ngay lập tức, tức thì", "Immediately, right away", "Phó từ", 6, [("请稍等，我马上就来。", "Qǐng shāoděng, wǒ mǎshàng jiù lái.", "Xin đợi chút, tôi tới ngay đây.", "Please wait a moment, I'll be there right away.")]),
    ("一直", "一直", "yìzhí", "yi zhi", "nhất trực", "Luôn luôn, thẳng một mạch", "Always, continuously, straight", "Phó từ", 9, [("他一直在努力学习汉语。", "Tā yìzhí zài nǔlì xuéxí Hànyǔ.", "Cậu ấy luôn luôn nỗ lực học tiếng Hán.", "He has always been studying Chinese diligently.")]),
    ("一定", "一定", "yídìng", "yi ding", "nhất định", "Nhất định, chắc chắn", "Definitely, must", "Phó từ", 9, [("明天你一定要来参加晚会。", "Míngtiān nǐ yídìng yào lái cānjiā wǎnhuì.", "Ngày mai bạn nhất định phải tới dự tiệc nhé.", "Tomorrow you must definitely come to the party.")]),
    ("先", "先", "xiān", "xian", "tiên", "Trước tiên, trước", "First, in advance", "Phó từ", 6, [("我们先吃饭，然后再去看电影。", "Wǒmen xiān chīfàn, ránhòu zài qù kàn diànyǐng.", "Chúng ta ăn cơm trước, sau đó hẵng đi xem phim.", "Let's eat first, then go watch a movie.")]),
    ("然后", "然後", "ránhòu", "ran hou", "nhiên hậu", "Sau đó, rồi thì", "Then, afterwards", "Liên từ", 18, [("先洗手，然后吃饭。", "Xiān xǐshǒu, ránhòu chīfàn.", "Rửa tay trước, sau đó mới ăn cơm.", "Wash hands first, then eat.")]),
    ("如果", "如果", "rúguǒ", "ru guo", "như quả", "Nếu như, giả sử", "If, in case", "Liên từ", 14, [("如果明天下雨，比赛就推迟。", "Rúguǒ míngtiān xiàyǔ, bǐsài jiù tuīchí.", "Nếu ngày mai mưa thì trận đấu hoãn lại.", "If it rains tomorrow, the match will be postponed.")]),
    ("而且", "而且", "érqiě", "er qie", "nhi thả", "Hơn nữa, vả lại", "Moreover, furthermore", "Liên từ", 11, [("这件衣服好看，而且很便宜。", "Zhè jiàn yīfu hǎokàn, érqiě hěn piányi.", "Bộ đồ này đẹp, hơn nữa còn rất rẻ.", "This clothing is nice-looking and moreover cheap.")]),
    ("或者", "或者", "huòzhě", "huo zhe", "hoặc giả", "Hoặc là (câu trần thuật)", "Or (in statements)", "Liên từ", 16, [("周末我们去爬山或者看电影。", "Zhōumò wǒmen qù páshān huòzhě kàn diànyǐng.", "Cuối tuần chúng mình đi leo núi hoặc xem phim.", "We go hiking or watch a movie on weekends.")]),
    
    # Environment, Places & Objects
    ("环境", "環境", "huánjìng", "huan jing", "hoàn cảnh", "Môi trường, hoàn cảnh", "Environment, surroundings", "Danh từ", 24, [("保护环境是每个人的责任。", "Bǎohù huánjìng shì měi gè rén de zérèn.", "Bảo vệ môi trường là trách nhiệm của mỗi người.", "Protecting the environment is everyone's responsibility.")]),
    ("历史", "歷史", "lìshǐ", "li shi", "lịch sử", "Lịch sử", "History", "Danh từ", 19, [("中国有悠久的历史文化。", "Zhōngguó yǒu yōujiǔ de lìshǐ wénhuà.", "Trung Quốc có lịch sử văn hóa lâu đời.", "China has a long history and culture.")]),
    ("文化", "文化", "wénhuà", "wen hua", "văn hóa", "Văn hóa", "Culture", "Danh từ", 8, [("多了解各国的传统文化。", "Duō liǎojiě gèguó de chuántǒng wénhuà.", "Tìm hiểu nhiều hơn về văn hóa truyền thống các nước.", "Understand more about traditional culture of nations.")]),
    ("银行", "銀行", "yínháng", "yin hang", "ngân hàng", "Ngân hàng", "Bank", "Danh từ", 20, [("我去银行取一点儿现金。", "Wǒ qù yínháng qǔ yìdiǎnr xiànjīn.", "Tôi đến ngân hàng rút một ít tiền mặt.", "I go to the bank to withdraw some cash.")]),
    ("地铁", "地鐵", "dìtiě", "di tie", "địa thiết", "Tàu điện ngầm", "Subway, metro", "Danh từ", 16, [("坐地铁比乘出租车更快。", "Zuò dìtiě bǐ chéng chūzūchē gèng kuài.", "Đi tàu điện ngầm nhanh hơn đi taxi.", "Taking the subway is faster than taking a taxi.")]),
    ("空调", "空調", "kōngtiáo", "kong tiao", "không điều", "Điều hòa nhiệt độ, máy lạnh", "Air conditioner", "Danh từ", 18, [("夏天太热了，把空调打开吧。", "Xiàtiān tài rè le, bǎ kōngtiáo dǎkāi ba.", "Mùa hè nóng quá, bật điều hòa lên đi.", "Summer is too hot, turn on the air conditioner.")]),
    ("冰箱", "冰箱", "bīngxiāng", "bing xiang", "băng sương", "Tủ lạnh", "Refrigerator", "Danh từ", 20, [("牛奶放在冰箱里。", "Niúnǎi fàng zài bīngxiāng lǐ.", "Sữa bò để trong tủ lạnh.", "Milk is kept inside the refrigerator.")]),
    ("筷子", "筷子", "kuàizi", "kuai zi", "khoái tử", "Đôi đũa", "Chopsticks", "Danh từ", 16, [("中国人习惯用筷子吃饭。", "Zhōngguó rén xíguàn yòng kuàizi chīfàn.", "Người Trung Quốc có thói quen dùng đũa ăn cơm.", "Chinese people are used to using chopsticks to eat.")]),
    ("碗", "碗", "wǎn", "wan", "oản", "Bát, chén (ăn cơm)", "Bowl", "Danh từ", 13, [("请给我拿一个小碗。", "Qǐng gěi wǒ ná yí gè xiǎo wǎn.", "Làm ơn lấy cho tôi một cái bát nhỏ.", "Please bring me a small bowl.")]),
    ("盘子", "盤子", "pánzi", "pan zi", "bàn tử", "Cái đĩa, khay", "Plate, dish", "Danh từ", 14, [("盘子里放着很多新鲜水果。", "Pánzi lǐ fàng zhe hěn duō xīnxiān shuǐguǒ.", "Trong đĩa bày rất nhiều hoa quả tươi.", "A lot of fresh fruit is placed on the plate.")]),
    ("菜单", "菜單", "càidān", "cai dan", "thái đơn", "Thực đơn, menu", "Menu", "Danh từ", 18, [("服务员，请给我们看下菜单。", "Fúwùyuán, qǐng gěi wǒmen kàn xià càidān.", "Phục vụ ơi, cho chúng tôi xem thực đơn với.", "Waiter, please let us see the menu.")]),
    ("香蕉", "香蕉", "xiāngjiāo", "xiang jiao", "hương tiêu", "Quả chuối tiêu", "Banana", "Danh từ", 21, [("猴子最喜欢吃香蕉。", "Hóuzi zuì xǐhuan chī xiāngjiāo.", "Khỉ thích ăn chuối tiêu nhất.", "Monkeys like eating bananas the most.")]),
    ("蛋糕", "蛋糕", "dàngāo", "dan gao", "đản cao", "Bánh ga-tô, bánh ngọt", "Cake", "Danh từ", 21, [("生日蛋糕上面点着蜡烛。", "Shēngrì dàngāo shàngmian diǎn zhe làzhú.", "Trên bánh sinh nhật thắp những cây nến.", "Candles are lit on the birthday cake.")]),
    ("啤酒", "啤酒", "píjiǔ", "pi jiu", "ti tửu", "Bia (đồ uống)", "Beer", "Danh từ", 20, [("夏天喝杯冰啤酒真爽快。", "Xiàtiān hē bēi bīng píjiǔ zhēn shuǎngkuai.", "Mùa hè uống ly bia lạnh thật sảng khoái.", "Drinking a cold beer in summer is refreshing.")]),
    ("照相机", "照相機", "zhàoxiàngjī", "zhao xiang ji", "chiếu tướng cơ", "Máy ảnh", "Camera", "Danh từ", 27, [("去旅游别忘了带照相机。", "Qù lǚyóu bié wàng le dài zhàoxiàngjī.", "Đi du lịch đừng quên mang máy ảnh.", "Don't forget to bring a camera when traveling.")]),
    ("照片", "照片", "zhàopiàn", "zhao pian", "chiếu phiến", "Bức ảnh, tấm hình", "Photo, photograph", "Danh từ", 17, [("这张照片拍得真美。", "Zhè zhāng zhàopiàn pāi de zhēn měi.", "Tấm ảnh này chụp đẹp thật.", "This photo was taken really beautifully.")]),
    ("护照", "護照", "hùzhào", "hu zhao", "hộ chiếu", "Hộ chiếu", "Passport", "Danh từ", 20, [("出国必须随身携带护照。", "Chūguó bìxū suíshēn xiédài hùzhào.", "Ra nước ngoài bắt buộc phải mang theo hộ chiếu bên mình.", "Must carry passport when going abroad.")]),
    ("行李箱", "行李箱", "xínglixiāng", "xing li xiang", "hành lý tương", "Va li hành lý", "Suitcase, luggage", "Danh từ", 25, [("把衣服整齐地放进行李箱。", "Bǎ yīfu zhěngqí de fàngjìn xínglixiāng.", "Xếp quần áo gọn gàng vào va li hành lý.", "Put clothes neatly into the suitcase.")]),
    ("办公室", "辦公室", "bàngōngshì", "ban gong shi", "biện công thất", "Văn phòng làm việc", "Office", "Danh từ", 19, [("王经理正在办公室批改文件。", "Wáng jīnglǐ zhèngzài bàngōngshì pīgǎi wénjiàn.", "Giám đốc Vương đang duyệt tài liệu trong văn phòng.", "Manager Wang is approving documents in the office.")]),
    ("会议", "會議", "huìyì", "hui yi", "hội nghị", "Cuộc họp, hội nghị", "Meeting, conference", "Danh từ", 12, [("明早九点有一个重要会议。", "Míngzǎo jiǔ diǎn yǒu yí gè zhòngyào huìyì.", "Sáng mai 9 giờ có một cuộc họp quan trọng.", "There is an important meeting at 9 tomorrow morning.")]),
    ("声音", "聲音", "shēngyīn", "sheng yin", "thanh âm", "Âm thanh, tiếng nói", "Sound, voice", "Danh từ", 16, [("说话的声音要大一点。", "Shuōhuà de shēngyīn yào dà yìdiǎn.", "Giọng nói chuyện cần to hơn một chút.", "The speaking voice should be a bit louder.")]),
    ("音乐", "音樂", "yīnyuè", "yin yue", "âm nhạc", "Âm nhạc", "Music", "Danh từ", 14, [("听音乐能放松心情。", "Tīng yīnyuè néng fàngsōng xīinqíng.", "Nghe nhạc giúp thư giãn tâm trạng.", "Listening to music relaxes the mood.")]),
    ("新闻", "新聞", "xīnwén", "xin wen", "tân văn", "Tin tức, thời sự", "News", "Danh từ", 22, [("每天看新闻了解世界大事。", "Měitiān kàn xīnwén liǎojiě shìjiè dàshì.", "Mỗi ngày xem tin tức để hiểu chuyện lớn thế giới.", "Watch the news every day to understand world events.")]),
    ("信用卡", "信用卡", "xìnyòngkǎ", "xin yong ka", "tín dụng tạp", "Thẻ tín dụng", "Credit card", "Danh từ", 22, [("这里可以用信用卡刷卡付款。", "Zhèlǐ kěyǐ yòng xìnyòngkǎ shuākǎ fùkuǎn.", "Ở đây có thể quẹt thẻ tín dụng thanh toán.", "Can pay by swiping credit card here.")]),
    ("钱包", "錢包", "qiánbāo", "qian bao", "tiền bao", "Cái ví tiền", "Wallet, purse", "Danh từ", 15, [("出门别忘了带上钱包。", "Chūmén bié wàng le dàishang qiánbāo.", "Ra ngoài chớ quên mang theo ví tiền.", "Don't forget to bring your wallet when going out.")]),
    ("司机", "司機", "sījī", "si ji", "ti cơ", "Bác tài, lái xe", "Driver", "Danh từ", 11, [("请问司机师傅，还有多久能到？", "Qǐngwèn sījī shīfu, hái yǒu duō jiǔ néng dào?", "Xin hỏi bác tài, còn bao lâu nữa thì tới?", "Excuse me driver, how much longer to arrive?")]),
    ("护士", "護士", "hùshi", "hu shi", "hộ sĩ", "Y tá, điều dưỡng", "Nurse", "Danh từ", 13, [("医院里的护士很温柔细心。", "Yīyuàn lǐ de hùshi hěn wēnróu xìxīn.", "Y tá trong bệnh viện rất dịu dàng và chu đáo.", "Nurses in the hospital are very gentle and attentive.")]),
    ("邻居", "鄰居", "línjū", "lin ju", "lân cư", "Hàng xóm láng giềng", "Neighbor", "Danh từ", 15, [("俗话说：远亲不如近邻。", "Súhuà shuō: Yuǎnqīn bùrú jìnlín.", "Tục ngữ có câu: Bà con xa không bằng láng giềng gần.", "As the saying goes: A distant relative is not as good as a near neighbor.")]),
    ("水平", "水平", "shuǐpíng", "shui ping", "thủy bình", "Trình độ, mức độ", "Level, standard", "Danh từ", 9, [("他的汉语水平进步很快。", "Tā de Hànyǔ shuǐpíng jìnbù hěn kuài.", "Trình độ tiếng Trung của anh ấy tiến bộ rất nhanh.", "His Chinese level has improved rapidly.")]),
    ("成绩", "成績", "chéngjì", "cheng ji", "thành tích", "Thành tích, điểm số", "Score, achievement", "Danh từ", 17, [("这次考试他取得了优异的成绩。", "Zhè cì kǎoshì tā qǔdé le yōuyì de chéngjì.", "Kỳ thi lần này anh ấy đạt được thành tích xuất sắc.", "In this exam he obtained excellent scores.")]),
    ("句子", "句子", "jùzi", "ju zi", "cú tử", "Câu văn, câu", "Sentence", "Danh từ", 8, [("请用这个生词造一个句子。", "Qǐng yòng zhè gè shēngcí zào yí gè jùzi.", "Xin hãy dùng từ mới này đặt một câu.", "Please make a sentence with this new word.")]),
    ("字典", "字典", "zìdiǎn", "zi dian", "tự điển", "Từ điển", "Dictionary", "Danh từ", 14, [("遇到生字可以查字典。", "Yùdào shēngzì kěyǐ chá zìdiǎn.", "Gặp chữ lạ có thể tra từ điển.", "When encountering unfamiliar words you can look up the dictionary.")]),
    ("段", "段", "duàn", "duan", "đoạn", "Đoạn (văn bản, thời gian)", "Paragraph, segment", "Lượng từ", 9, [("请朗读下面这段文章。", "Qǐng lǎngdú xiàmiàn zhè duàn wénzhāng.", "Mời đọc to đoạn văn bên dưới.", "Please read aloud this paragraph below.")]),
    ("种", "種", "zhǒng", "zhong", "chủng", "Loại, giống", "Kind, type", "Lượng từ", 9, [("超市里卖很多种茶叶。", "Chāoshì lǐ mài hěn duō zhǒng cháyè.", "Trong siêu thị bán rất nhiều loại trà.", "The supermarket sells many types of tea.")]),
    ("双", "雙", "shuāng", "shuang", "song", "Đôi, cặp (đũa, giày)", "Pair (shoes, chopsticks)", "Lượng từ", 4, [("买了一双舒适的运动鞋。", "Mǎi le yì shuāng shūshì de yùndòngxié.", "Đã mua một đôi giày thể thao thoải mái.", "Bought a pair of comfortable sports shoes.")]),
    ("条", "條", "tiáo", "tiao", "điều", "Con, chiếc (vật dài hẹp: cá, đường, quần)", "Measure word for long objects", "Lượng từ", 7, [("湖里游着几条小金鱼。", "Hú lǐ yóu zhe jǐ tiáo xiǎo jīnyú.", "Dưới hồ bơi lội mấy chú cá vàng nhỏ.", "A few small goldfish are swimming in the lake.")]),
    ("张", "張", "zhāng", "zhang", "trương", "Tấm, tờ (vé, ảnh, giấy)", "Sheet, piece", "Lượng từ", 7, [("钱包里有两张车票。", "Qiánbāo lǐ yǒu liǎng zhāng chēpiào.", "Trong ví có hai tấm vé xe.", "There are two tickets in the wallet.")]),
]

def generate_hsk3():
    seen = set()
    items = []
    idx = 1
    for row in HSK3_RAW:
        simp, trad, py, clean, hv, vi, en, pos, strokes, exs = row
        if simp in seen:
            continue
        seen.add(simp)
        item = {
            "hsk_level": 3,
            "simplified": simp,
            "traditional": trad,
            "pinyin": py,
            "pinyin_clean": clean,
            "han_viet": hv,
            "meaning_vi": vi,
            "meaning_en": en,
            "part_of_speech": pos,
            "stroke_count": strokes,
            "frequency_rank": idx,
            "examples": [
                {"chinese": ex[0], "pinyin": ex[1], "meaning_vi": ex[2], "meaning_en": ex[3]}
                for ex in exs
            ]
        }
        items.append(item)
        idx += 1
    return items

if __name__ == "__main__":
    items = generate_hsk3()
    print(f"Total Unique HSK 3: {len(items)}")
    with open("/home/admin1/hskde/backend/app/data/hsk3_vocab.py", "w", encoding="utf-8") as f:
        f.write("# HSK 3 Authentic Vocabulary Dataset (100+ entries)\n")
        f.write("HSK3_VOCAB = ")
        f.write(pprint.pformat(items, indent=4, width=120, compact=False))
        f.write("\n")
    print("Written /home/admin1/hskde/backend/app/data/hsk3_vocab.py successfully!")
