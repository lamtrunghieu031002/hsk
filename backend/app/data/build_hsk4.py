import pprint

HSK4_RAW = [
    # Mindset, Attitude & Personality
    ("坚持", "堅持", "jiānchí", "jian chi", "kiên trì", "Kiên trì, giữ vững", "To persevere, persist", "Động từ", 18, [("只要坚持到底，就一定会成功。", "Zhǐyào jiānchí dàodǐ, jiù yídìng huì chénggōng.", "Chỉ cần kiên trì đến cùng, nhất định sẽ thành công.", "As long as you persevere to the end, you will succeed.")]),
    ("成功", "成功", "chénggōng", "cheng gong", "thành công", "Thành công", "To succeed, success", "Động từ / Danh từ", 11, [("失败是成功之母。", "Shībài shì chénggōng zhī mǔ.", "Thất bại là mẹ thành công.", "Failure is the mother of success.")]),
    ("积累", "積累", "jīlěi", "ji lei", "tích lũy", "Tích lũy (kinh nghiệm, vốn)", "To accumulate", "Động từ / Danh từ", 21, [("在工作中不断积累宝贵的经验。", "Zài gōngzuò zhōng búduàn jīlěi bǎoguì de jīngyàn.", "Không ngừng tích lũy kinh nghiệm quý báu trong công việc.", "Continuously accumulate valuable experience in work.")]),
    ("关键", "關鍵", "guānjiàn", "guan jian", "quan kiện", "Mấu chốt, then chốt", "Key, critical, crucial", "Danh từ / Tính từ", 20, [("态度是决定成败的关键。", "Tàidù shì juédìng chéngbài de guānjiàn.", "Thái độ là mấu chốt quyết định thành bại.", "Attitude is the key deciding success or failure.")]),
    ("态度", "態度", "tàidu", "tai du", "thái độ", "Thái độ, cách nhìn nhận", "Attitude, manner", "Danh từ", 14, [("积极端正的工作态度很重要。", "Jījí duānzhèng de gōngzuò tàidu hěn zhòngyào.", "Thái độ làm việc tích cực đúng đắn rất quan trọng.", "A positive and upright work attitude is very important.")]),
    ("压力", "壓力", "yālì", "ya li", "áp lực", "Áp lực, sức ép", "Pressure, stress", "Danh từ", 8, [("现代年轻人的工作压力很大。", "Xiàndài niánqīngrén de gōngzuò yālì hěn dà.", "Áp lực công việc của giới trẻ hiện đại rất lớn.", "The work pressure of modern young people is very big.")]),
    ("鼓励", "鼓勵", "gǔlì", "gu li", "cổ lệ", "Khuyến khích, động viên", "To encourage", "Động từ / Danh từ", 24, [("老师经常鼓励我们要多开口说汉语。", "Lǎoshī jīngcháng gǔlì wǒmen yào duō kāikǒu shuō Hànyǔ.", "Thầy giáo thường xuyên động viên chúng tôi phải nói tiếng Trung nhiều hơn.", "The teacher often encourages us to speak more Chinese.")]),
    ("丰富", "豐富", "fēngfù", "feng fu", "phong phú", "Phong phú, dồi dào", "Rich, abundant", "Tính từ / Động từ", 24, [("他的阅历和工作经验非常丰富。", "Tā de yuèlì hé gōngzuò jīngyàn fēicháng fēngfù.", "Vốn sống và kinh nghiệm làm việc của anh ấy rất phong phú.", "His life experience and work experience are very rich.")]),
    ("优秀", "優秀", "yōuxiù", "you xiu", "ưu tú", "Ưu tú, xuất sắc", "Excellent, outstanding", "Tính từ", 18, [("他是一位非常优秀的工程师。", "Tā shì yí wèi fēicháng yōuxiù de gōngchéngshī.", "Anh ấy là một kỹ sư vô cùng xuất sắc.", "He is a very outstanding engineer.")]),
    ("幽默", "幽默", "yōumò", "you mo", "u mặc", "Hài hước, hóm hỉnh", "Humorous, humor", "Tính từ / Danh từ", 13, [("他说话生动幽默，大家都很喜欢他。", "Tā shuōhuà shēngdòng yōumò, dàjiā dōu hěn xǐhuan tā.", "Anh ấy nói chuyện sinh động hài hước, ai nấy đều mến anh.", "He speaks vividly and humorously, everyone likes him.")]),
    ("诚实", "誠實", "chéngshí", "cheng shi", "thành thực", "Thành thật, thật thà", "Honest", "Tính từ", 19, [("做人必须诚实守信。", "Zuòrén bìxū chéngshí shǒuxìn.", "Làm người bắt buộc phải thành thực giữ chữ tín.", "One must be honest and trustworthy.")]),
    ("勇敢", "勇敢", "yǒnggǎn", "yong gan", "dũng cảm", "Dũng cảm, can đảm", "Brave, courageous", "Tính từ", 20, [("面对困难要勇敢地迎上去。", "Miànduì kùnnán yào yǒnggǎn de yíng shàngqù.", "Đối mặt với khó khăn phải dũng cảm xông lên.", "Face difficulties bravely.")]),
    ("骄傲", "驕傲", "jiāo'ào", "jiao ao", "kiêu ngạo", "Tự hào, kiêu ngạo", "Proud, arrogant", "Tính từ", 22, [("父母为他的成就感到骄傲。", "Fùmǔ wèi tā de chéngjiù gǎndào jiāo'ào.", "Bố mẹ cảm thấy tự hào vì những thành tựu của anh ấy.", "Parents feel proud of his achievements.")]),
    ("谦虚", "謙虛", "qiānxū", "qian xu", "khiêm hư", "Khiêm tốn", "Modest, humble", "Tính từ", 22, [("谦虚使人进步，骄傲使人落后。", "Qiānxū shǐ rén jìnbù, jiāo'ào shǐ rén luòhòu.", "Khiêm tốn giúp người ta tiến bộ, kiêu ngạo khiến người ta thụt lùi.", "Modesty helps one make progress, pride makes one lag behind.")]),
    ("积极", "積極", "jījí", "ji ji", "tích cực", "Tích cực, hăng hái", "Positive, active", "Tính từ", 22, [("面对生活我们要保持积极的心态。", "Miànduì shēnghuó wǒmen yào bǎochí jījí de xīntài.", "Đối mặt với cuộc sống, chúng ta phải giữ tâm thái tích cực.", "Facing life we must maintain a positive mindset.")]),
    ("粗心", "粗心", "cūxīn", "cu xin", "thô tâm", "Cẩu thả, bất cẩn", "Careless, thoughtless", "Tính từ", 15, [("考试时千万不能粗心大意。", "Kǎoshì shí qiānwàn bù néng cūxīn dàyì.", "Khi thi cử tuyệt đối không được cẩu thả sơ ý.", "Must never be careless during exams.")]),
    ("活泼", "活潑", "huópo", "huo po", "hoạt bát", "Hoạt bát, năng động", "Lively, vivacious", "Tính từ", 24, [("小姑娘性格很开朗活泼。", "Xiǎogūniang xìnggé hěn kāilǎng huópo.", "Cô bé tính tình rất cởi mở hoạt bát.", "The young girl has a cheerful and lively personality.")]),
    ("害羞", "害羞", "hàixiū", "hai xiu", "hại tu", "Xấu hổ, bẽn lẽn", "Shy, bashful", "Tính từ", 20, [("他在陌生人面前容易害羞。", "Tā zài mòshēngrén miànqián róngyì hàixiū.", "Anh ấy trước mặt người lạ rất dễ xấu hổ.", "He gets shy easily in front of strangers.")]),
    ("幸福", "幸福", "xìngfú", "xing fu", "hạnh phúc", "Hạnh phúc", "Happy, happiness", "Danh từ / Tính từ", 22, [("一家人健康在一起就是最大的幸福。", "Yì jiā rén jiànkāng zài yìqǐ jiù shì zuì dà de xìngfú.", "Cả nhà khỏe mạnh bên nhau chính là niềm hạnh phúc lớn nhất.", "A family staying healthy together is the greatest happiness.")]),
    ("烦恼", "煩惱", "fánnǎo", "fan nao", "phiền não", "Phiền muộn, buồn rầu", "Troubled, worry", "Động từ / Danh từ", 23, [("别为这点小事烦恼了。", "Bié wèi zhè diǎn xiǎoshì fánnǎo le.", "Đừng vì chút chuyện cỏn con này mà phiền não.", "Don't be troubled over such small matters.")]),
    ("轻松", "輕鬆", "qīngsōng", "qing song", "khinh tùng", "Nhẹ nhõm, thoải mái", "Relaxed, light", "Tính từ", 19, [("考完试后整个人都轻松了。", "Kǎowán shì hòu zhěng gè rén dōu qīngsōng le.", "Thi xong cả người đều thấy nhẹ nhõm hẳn.", "After finishing the exam, the whole person feels relaxed.")]),
    
    # Career, Work & Society
    ("经验", "經驗", "jīngyàn", "jing yan", "kinh nghiệm", "Kinh nghiệm", "Experience", "Danh từ", 23, [("他在这行工作多年，很有经验。", "Tā zài zhè háng gōngzuò duō nián, hěn yǒu jīngyàn.", "Anh ấy làm trong ngành này nhiều năm, rất có kinh nghiệm.", "He worked in this field for many years and has a lot of experience.")]),
    ("过程", "過程", "guòchéng", "guo cheng", "quá trình", "Quá trình, tiến trình", "Process, course", "Danh từ", 18, [("学习是一步一步积累的过程。", "Xuéxí shì yíbù yíbù jīlěi de guòchéng.", "Học tập là một quá trình tích lũy từng bước một.", "Learning is a step-by-step accumulation process.")]),
    ("结果", "結果", "jiéguǒ", "jie guo", "kết quả", "Kết quả, hậu quả", "Result, outcome", "Danh từ", 20, [("不管结果如何，我们都尽力了。", "Bùguǎn jiéguǒ rúhé, wǒmen dōu jìnlì le.", "Bất luận kết quả ra sao, chúng tôi đều đã cố hết sức.", "Regardless of the result, we did our best.")]),
    ("目的", "目的", "mùdì", "mu di", "mục đích", "Mục đích, ý định", "Purpose, goal", "Danh từ", 13, [("你做这件事的目的是什么？", "Nǐ zuò zhè jiàn shì de mùdì shì shénme?", "Mục đích bạn làm việc này là gì?", "What is the purpose of your doing this?")]),
    ("原因", "原因", "yuányīn", "yuan yin", "nguyên nhân", "Nguyên nhân, lý do", "Reason, cause", "Danh từ", 16, [("失败的原因需要认真总结。", "Shībài de yuányīn xūyào rènzhēn zǒngjié.", "Nguyên nhân thất bại cần phải tổng kết nghiêm túc.", "The cause of failure needs to be summarized carefully.")]),
    ("规定", "規定", "guīdìng", "gui ding", "quy định", "Quy định, điều lệ", "Rule, regulation", "Động từ / Danh từ", 16, [("请严格遵守公司的各项规定。", "Qǐng yángé zūnshǒu gōngsī de gèxiàng guīdìng.", "Xin hãy tuân thủ nghiêm ngặt các quy định của công ty.", "Please strictly comply with company regulations.")]),
    ("法律", "法律", "fǎlǜ", "fa lv", "pháp luật", "Pháp luật, luật lệ", "Law", "Danh từ", 17, [("公民都必须遵守国家法律。", "Gōngmín dōu bìxū zūnshǒu guójiā fǎlǜ.", "Công dân đều phải tuân thủ pháp luật nhà nước.", "Citizens must all comply with national law.")]),
    ("经济", "經濟", "jīngjì", "jing ji", "kinh tế", "Kinh tế", "Economy, financial", "Danh từ", 19, [("近年来国家经济快速增长。", "Jìnnián lái guójiā jīngjì kuàisù zēngzhǎng.", "Những năm gần đây kinh tế đất nước tăng trưởng nhanh chóng.", "In recent years the national economy has grown rapidly.")]),
    ("科学", "科學", "kēxué", "ke xue", "khoa học", "Khoa học", "Science", "Danh từ", 25, [("科学技术深刻改变了人们的生活。", "Kēxué jìshù shēnkè gǎibiàn le rénmen de shēnghuó.", "Khoa học kỹ thuật đã thay đổi sâu sắc đời sống con người.", "Science and technology have deeply changed people's lives.")]),
    ("艺术", "藝術", "yìshù", "yi shu", "nghệ thuật", "Nghệ thuật", "Art", "Danh từ", 12, [("她从小就对绘画艺术非常感兴趣。", "Tā cóngxiǎo jiù duì huìhuà yìshù fēicháng gǎn xìngqù.", "Từ nhỏ cô ấy đã rất có hứng thú với nghệ thuật hội họa.", "She was interested in the art of painting since childhood.")]),
    ("交流", "交流", "jiāoliú", "jiao liu", "giao lưu", "Giao lưu, trao đổi", "To communicate, exchange", "Động từ / Danh từ", 16, [("国际文化交流促进了两国友谊。", "Guójì wénhuà jiāoliú cùjìn le liǎng guó yǒuyì.", "Giao lưu văn hóa quốc tế đã thúc đẩy tình hữu nghị hai nước.", "International cultural exchange promoted bilateral friendship.")]),
    ("讨论", "討論", "tǎolùn", "tao lun", "thảo luận", "Thảo luận, bàn bạc", "To discuss", "Động từ", 15, [("大家围绕这个话题热烈讨论。", "Dàjiā wéirào zhè gè huàtí rèliè tǎolùn.", "Mọi người xoay quanh chủ đề này thảo luận sôi nổi.", "Everyone warmly discussed surrounding this topic.")]),
    ("合作", "合作", "hézuò", "he zuo", "hợp tác", "Hợp tác, làm việc nhóm", "To cooperate, collaboration", "Động từ / Danh từ", 14, [("团队合作是完成项目的保障。", "Tuánduì hézuò shì wánchéng xiàngmù de bǎozhàng.", "Hợp tác đồng đội là bảo đảm để hoàn thành dự án.", "Team cooperation is the guarantee for completing the project.")]),
    ("竞争", "競爭", "jìngzhēng", "jing zheng", "cạnh tranh", "Cạnh tranh, thi đua", "To compete, competition", "Động từ / Danh từ", 14, [("市场竞争促使企业提高产品质量。", "Shìchǎng jìngzhēng cùshǐ qǐyè tígāo chǎnpǐn zhìliàng.", "Cạnh tranh thị trường thúc giục doanh nghiệp nâng cao chất lượng sản phẩm.", "Market competition urges enterprises to raise product quality.")]),
    ("安排", "安排", "ānpái", "an pai", "an bài", "Sắp xếp, bố trí", "To arrange, plan", "Động từ / Danh từ", 17, [("这周的工作日程已经安排好了。", "Zhè zhōu de gōngzuò rìchéng yǐjīng ānpái hǎo le.", "Lịch trình công việc tuần này đã sắp xếp xong rồi.", "This week's work schedule has already been arranged.")]),
    ("保证", "保證", "bǎozhèng", "bao zheng", "bảo chứng", "Bảo đảm, cam đoan", "To guarantee, pledge", "Động từ / Danh từ", 21, [("我保证明天一定按时交报告。", "Wǒ bǎozhèng míngtiān yídìng ànshí jiāo bàogào.", "Tôi bảo đảm ngày mai nhất định nộp báo cáo đúng giờ.", "I guarantee I will submit the report on time tomorrow.")]),
    ("允许", "允許", "yǔnxǔ", "yun xu", "duyệt hứa", "Cho phép, chuẩn thuận", "To permit, allow", "Động từ", 15, [("未经允许，请勿入内。", "Wèijīng yǔnxǔ, qǐng wù rùnèi.", "Chưa được sự cho phép, xin đừng vào trong.", "No entry without permission.")]),
    ("拒绝", "拒絕", "jùjué", "ju jue", "cự tuyệt", "Từ chối, cự tuyệt", "To refuse, reject", "Động từ", 20, [("他委婉地拒绝了对方的邀请。", "Tā wěiwǎn de jùjué le duìfāng de yāoqǐng.", "Anh ấy đã từ chối khéo léo lời mời của đối phương.", "He politely rejected the other party's invitation.")]),
    ("建议", "建議", "jiànyì", "jian yi", "kiến nghị", "Gợi ý, đề xuất, kiến nghị", "To suggest, proposal", "Động từ / Danh từ", 21, [("谢谢你提出了非常中肯的建议。", "Xièxie nǐ tíchū le fēicháng zhòngkěn de jiànyì.", "Cảm ơn bạn đã đưa ra lời kiến nghị rất xác đáng.", "Thank you for putting forward very pertinent suggestions.")]),
    ("批评", "批評", "pīpíng", "pi ping", "phê bình", "Phê bình, chỉ trích", "To criticize", "Động từ / Danh từ", 15, [("虚心接受大家的批评与指正。", "Xūxīn jiēshòu dàjiā de pīpíng yǔ zhǐzhèng.", "Khiêm tốn tiếp thu lời phê bình và chỉ bảo của mọi người.", "Humbly accept everyone's criticism and correction.")]),
    ("表扬", "表揚", "biǎoyáng", "biao yang", "biểu dương", "Biểu dương, khen ngợi", "To praise, commend", "Động từ / Danh từ", 17, [("老师在全班面前表扬了他的进步。", "Lǎoshī zài quán bān miànqián biǎoyáng le tā de jìnbù.", "Thầy giáo trước toàn lớp đã khen ngợi sự tiến bộ của cậu.", "The teacher praised his progress in front of the whole class.")]),
    ("申请", "申請", "shēnqǐng", "shen qing", "thân thỉnh", "Đơn xin, nộp đơn đăng ký", "To apply for", "Động từ / Danh từ", 17, [("他向学校申请了全额奖学金。", "Tā xiàng xuéxiào shēnqǐng le quán'é jiǎngxuéjīn.", "Anh ấy đã nộp đơn xin học bổng toàn phần lên nhà trường.", "He applied to the school for a full scholarship.")]),
    ("招聘", "招聘", "zhāopìn", "zhao pin", "chiêu sính", "Tuyển dụng, tuyển nhân sự", "To recruit, hiring", "Động từ", 24, [("公司正在招聘几名软件工程师。", "Gōngsī zhèngzài zhāopìn jǐ míng ruǎnjiàn gōngchéngshī.", "Công ty đang tuyển dụng vài kỹ sư phần mềm.", "The company is recruiting several software engineers.")]),
    ("简历", "簡歷", "jiǎnlì", "jian li", "giản lịch", "Sơ yếu lý lịch, CV", "Resume, CV", "Danh từ", 21, [("请把个人简历发送到公司邮箱。", "Qǐng bǎ gèrén jiǎnlì fāsòng dào gōngsī yóuxiāng.", "Xin gửi sơ yếu lý lịch cá nhân vào hòm thư công ty.", "Please send your resume to the company email.")]),
    ("面试", "面試", "miànshì", "mian shi", "diện thí", "Phỏng vấn", "Interview, to interview", "Động từ / Danh từ", 17, [("明天下午两点我有一场工作面试。", "Míngtiān xiàwǔ liǎng diǎn wǒ yǒu yì chǎng gōngzuò miànshì.", "Chiều mai hai giờ tôi có một buổi phỏng vấn việc làm.", "Tomorrow at 2 p.m. I have a job interview.")]),
    ("工资", "工資", "gōngzī", "gong zi", "công tư", "Tiền lương, tiền công", "Salary, wage", "Danh từ", 13, [("月底发工资后我们去庆祝一下。", "Yuèdǐ fā gōngzī hòu wǒmen qù qìngzhù yíxià.", "Cuối tháng phát lương xong chúng mình đi liên hoan nhé.", "Let's celebrate after getting salary at the end of month.")]),
    ("标准", "標準", "biāozhǔn", "biao zhun", "tiêu chuẩn", "Tiêu chuẩn, chuẩn mực", "Standard, criterion", "Danh từ / Tính từ", 19, [("他的普通话说得非常标准。", "Tā de Pǔtōnghuà shuō de fēicháng biāozhǔn.", "Tiếng phổ thông của anh ấy nói vô cùng chuẩn.", "His Mandarin is spoken very standardly.")]),
    ("条件", "條件", "tiáojiàn", "tiao jian", "điều kiện", "Điều kiện", "Condition, requirement", "Danh từ", 13, [("他完全符合这次招聘的录用条件。", "Tā wánquán fúhé zhè cì zhāopìn de lùyòng tiáojiàn.", "Anh ấy hoàn toàn phù hợp điều kiện tuyển dụng lần này.", "He fully matches the hiring conditions of this recruitment.")]),
    ("效果", "效果", "xiàoguǒ", "xiao guo", "hiệu quả", "Hiệu quả, tác dụng", "Effect, result", "Danh từ", 16, [("这种新药的治疗效果非常显著。", "Zhè zhǒng xīn yào de zhìliáo xiàoguǒ fēicháng xiǎnzhù.", "Hiệu quả trị liệu của loại thuốc mới này rất rõ rệt.", "The therapeutic effect of this new medicine is prominent.")]),
    ("重点", "重點", "zhòngdiǎn", "zhong dian", "trọng điểm", "Trọng điểm, điểm mấu chốt", "Focus, key point", "Danh từ", 18, [("老师画出了本课复习的重点内容。", "Lǎoshī huàchū le běn kè fùxí de zhòngdiǎn nèiróng.", "Thầy giáo đã vạch ra nội dung trọng điểm ôn tập của bài này.", "The teacher highlighted the key review points of this lesson.")]),
    
    # Connectors & Discourse Markers
    ("甚至", "甚至", "shènzhì", "shen zhi", "thậm chí", "Thậm chí, ngay cả", "Even, so much that", "Phó từ / Liên từ", 15, [("他激动得甚至说不出话来。", "Tā jīdòng de shènzhì shuōbùchū huà lái.", "Anh ấy xúc động đến mức thậm chí không nói nên lời.", "He was so excited that he even could not speak.")]),
    ("既然", "既然", "jìrán", "ji ran", "ký nhiên", "Một khi đã... thì", "Since, given that", "Liên từ", 19, [("既然决定了，就要全力以赴去做。", "Jìrán juédìng le, jiù yào quánlì yǐ fù qù zuò.", "Một khi đã quyết định thì phải dốc toàn lực thực hiện.", "Since you decided, you should go all out to do it.")]),
    ("究竟", "究竟", "jiūjìng", "jiu jing", "cứu cánh", "Rốt cuộc, rốt cục", "After all, actually", "Phó từ", 15, [("事情的真相究竟是什么？", "Shìqing de zhēnxiàng jiūjìng shì shénme?", "Chân tướng sự việc rốt cuộc là gì?", "What is actually the truth of the matter?")]),
    ("无论", "無論", "wúlùn", "wu lun", "vô luận", "Bất luận, dù cho", "Regardless of, no matter", "Liên từ", 18, [("无论刮风下雨，他都坚持锻炼。", "Wúlùn guāfēng xiàyǔ, tā dōu jiānchí duànliàn.", "Bất luận mưa gió, anh ấy đều kiên trì tập luyện.", "No matter wind or rain, he persists in exercising.")]),
    ("不仅", "不僅", "bùjǐn", "bu jin", "bất cận", "Không những, không chỉ", "Not only", "Liên từ", 12, [("他不仅会说汉语，还会说法语。", "Tā bùjǐn huì shuō Hànyǔ, hái huì shuō Fǎyǔ.", "Anh ấy không những biết nói tiếng Hán mà còn biết tiếng Pháp.", "Not only can he speak Chinese, he can also speak French.")]),
    ("并且", "並且", "bìngqiě", "bing qie", "tịnh thả", "Và, đồng thời, hơn nữa", "And, moreover", "Liên từ", 13, [("他接受了批评，并且改正了错误。", "Tā jiēshòu le pīpíng, bìngqiě gǎizhèng le cuòwù.", "Anh ấy đã tiếp thu phê bình và sửa chữa sai sót.", "He accepted the criticism and furthermore corrected the mistakes.")]),
    ("按照", "按照", "ànzhào", "an zhao", "án chiếu", "Căn cứ theo, dựa theo", "According to", "Giới từ", 22, [("请按照说明书上的步骤操作。", "Qǐng ànzhào shuōmíngshū shang de bùzhòu cāozuò.", "Xin hãy thao tác theo các bước trên sách hướng dẫn.", "Please operate according to the steps on the manual.")]),
    ("即使", "即使", "jíshǐ", "ji shi", "tức sử", "Cho dù, dẫu cho", "Even if, even though", "Liên từ", 16, [("即使失败了，也不要灰心丧气。", "Jíshǐ shībài le, yě bú yào huīxīn sàngqì.", "Cho dù có thất bại cũng đừng nản lòng thoái chí.", "Even if you fail, don't lose heart.")]),
    ("然而", "然而", "rán'ér", "ran er", "nhiên nhi", "Thế nhưng, tuy vậy", "However, yet", "Liên từ", 18, [("他付出了努力，然而未能如愿。", "Tā fùchū le nǔlì, rán'ér wèinéng rúyuàn.", "Anh ấy đã nỗ lực, thế nhưng vẫn chưa toại nguyện.", "He made efforts, however could not fulfill his wish.")]),
    ("相反", "相反", "xiāngfǎn", "xiang fan", "tương phản", "Ngược lại, trái lại", "Opposite, contrary", "Tính từ / Liên từ", 13, [("事实与大家的推测恰恰相反。", "Shìshí yǔ dàjiā de tuīcè qiàqià xiāngfǎn.", "Sự thật hoàn toàn trái ngược với suy đoán của mọi người.", "The fact is just the opposite of everyone's speculation.")]),
    ("严格", "嚴格", "yángé", "yan ge", "nghiêm cách", "Nghiêm khắc, ngặt nghèo", "Strict, rigorous", "Tính từ", 24, [("实验必须严格按照标准执行。", "Shíyàn bìxū yángé ànzhào biāozhǔn zhíxíng.", "Thí nghiệm bắt buộc phải thực hiện nghiêm ngặt theo chuẩn.", "The experiment must strictly follow standards.")]),
    ("普遍", "普遍", "pǔbiàn", "pu bian", "phổ biến", "Phổ biến, rộng khắp", "Universal, widespread", "Tính từ", 24, [("手机支付在现代社会已经非常普遍。", "Shǒujī zhìfù zài xiàndài shèhuì yǐjīng fēicháng pǔbiàn.", "Thanh toán di động trong xã hội hiện đại đã rất phổ biến.", "Mobile payment is very universal in modern society.")]),
    ("正常", "正常", "zhèngcháng", "zheng chang", "chính thường", "Bình thường, thông thường", "Normal, regular", "Tính từ", 16, [("机器运转正常，没有任何故障。", "Jīqì yùnzhuǎn zhèngcháng, méiyǒu rènhé gùzhàng.", "Máy móc vận hành bình thường, không có bất kỳ trục trặc nào.", "The machine operates normally without any malfunction.")]),
    ("暂时", "暫時", "zànshí", "zan shi", "tạm thời", "Tạm thời, trước mắt", "Temporary, for now", "Phó từ / Danh từ", 22, [("会议暂时告一段落。", "Huìyì zànshí gào yí duànluò.", "Cuộc họp tạm thời khép lại một chặng.", "The meeting has temporarily come to an end.")]),
    ("逐渐", "逐漸", "zhújiàn", "zhu jian", "trục tiệm", "Dần dần, từng bước một", "Gradually", "Phó từ", 18, [("天气逐渐转凉，秋天到了。", "Tiānqì zhújiàn zhuǎn liáng, qiūtiān dào le.", "Thời tiết dần chuyển mát, mùa thu đã đến.", "The weather gradually turns cool, autumn arrived.")]),
    ("偶尔", "偶爾", "ǒu'ěr", "ou er", "ngẫu nhĩ", "Thỉnh thoảng, đôi khi", "Occasionally, once in a while", "Phó từ", 25, [("周末偶尔会去郊外露营。", "Zhōumò ǒu'ěr huì qù jiāowài lùyíng.", "Cuối tuần thỉnh thoảng có đi cắm trại ở ngoại ô.", "Occasionally go camping in the suburbs on weekends.")]),
    ("顺便", "順便", "shùnbiàn", "shun bian", "thuận tiện", "Nhân tiện, tiện thể", "Conveniently, in passing", "Phó từ", 21, [("你下楼时顺便帮我取个快递吧。", "Nǐ xià lóu shí shùnbiàn bāng wǒ qǔ gè kuàidì ba.", "Khi xuống lầu bạn nhân tiện lấy giúp tôi bưu phẩm nhé.", "While going downstairs, conveniently pick up a package for me.")]),
    ("至少", "至少", "zhìshǎo", "zhi shao", "chí thiểu", "Ít nhất, tối thiểu", "At least", "Phó từ", 10, [("每天至少要喝八杯水。", "Měitiān zhìshǎo yào hē bā bēi shuǐ.", "Mỗi ngày tối thiểu nên uống 8 ly nước.", "Should drink at least eight glasses of water every day.")]),
    ("差不多", "差不多", "chàbuduō", "cha bu duo", "sai bất đa", "Xấp xỉ, tương đương, gần như", "Almost, about the same", "Tính từ / Phó từ", 19, [("两件衣服的质量差不多。", "Liǎng jiàn yīfu de zhìliàng chàbuduō.", "Chất lượng hai chiếc áo gần như tương đương nhau.", "The quality of the two clothes is about the same.")]),
    ("本来", "本來", "běnlái", "ben lai", "bản lai", "Vốn dĩ, ban đầu", "Originally, at first", "Phó từ", 12, [("我本来打算昨天去的，后来下雨了。", "Wǒ běnlái dǎsuàn zuótiān qù de, hòulái xiàyǔ le.", "Ban đầu tôi định hôm qua đi, sau đó trời đổ mưa.", "I originally planned to go yesterday, but then it rained.")]),
    ("到底", "到底", "dàodǐ", "dao di", "đáo để", "Rốt cuộc (nhấn mạnh nghi vấn)", "In the end, on earth", "Phó từ", 16, [("你到底想去哪里旅行？", "Nǐ dàodǐ xiǎng qù nǎlǐ lǚxíng?", "Rốt cuộc bạn muốn đi du lịch ở đâu?", "Where on earth do you want to travel?")]),
    ("难道", "難道", "nándào", "nan dao", "nan đạo", "Chẳng lẽ, há lẽ", "Could it be that...?", "Phó từ", 22, [("难道你不知道明天放假吗？", "Nándào nǐ bù zhīdào míngtiān fàngjià ma?", "Chẳng lẽ bạn không biết ngày mai được nghỉ sao?", "Could it be that you don't know tomorrow is a holiday?")]),
    
    # Objects, Roles & Society
    ("垃圾桶", "垃圾桶", "lājītǒng", "la ji tong", "lạp tát dũng", "Thùng rác", "Trash can, dustbin", "Danh từ", 26, [("请把果皮扔进垃圾桶里。", "Qǐng bǎ guǒpí rēng jìn lājītǒng lǐ.", "Làm ơn vứt vỏ trái cây vào trong thùng rác.", "Please throw the fruit peels into the trash can.")]),
    ("钥匙", "鑰匙", "yàoshi", "yao shi", "thược thi", "Chìa khóa", "Key", "Danh từ", 25, [("出门前记得带上家门钥匙。", "Chūmén qián jìde dàishang jiāmén yàoshi.", "Trước khi ra ngoài nhớ mang theo chìa khóa nhà.", "Remember to take house keys before going out.")]),
    ("镜子", "鏡子", "jìngzi", "jing zi", "kính tử", "Gương soi", "Mirror", "Danh từ", 19, [("她对着镜子整理头发。", "Tā duì zhe jìngzi zhěnglǐ tóufa.", "Cô ấy nhìn vào gương chỉnh lại mái tóc.", "She tidies her hair looking in the mirror.")]),
    ("窗户", "窗戶", "chuānghu", "chuang hu", "song hộ", "Cửa sổ", "Window", "Danh từ", 16, [("把窗户打开透透新鲜空气。", "Bǎ chuānghu dǎkāi tòutòu xīnxiān kōngqì.", "Mở cửa sổ ra cho thoáng khí trong lành.", "Open the window to let in some fresh air.")]),
    ("袜子", "襪子", "wàzi", "wa zi", "ngoa tử", "Tất, vớ", "Socks", "Danh từ", 15, [("冬天穿厚袜子很暖和。", "Dōngtiān chuān hòu wàzi hěn nuǎnhuo.", "Mùa đông mang tất dày rất ấm áp.", "Wearing thick socks in winter is warm.")]),
    ("帽子", "帽子", "màozi", "mao zi", "mạo tử", "Cái mũ, nón", "Hat, cap", "Danh từ", 14, [("夏天戴一顶遮阳帽子。", "Xiàtiān dài yì dǐng zhēyáng màozi.", "Mùa hè đội một chiếc mũ che nắng.", "Wear a sun hat in summer.")]),
    ("密码", "密碼", "mìmǎ", "mi ma", "mật mã", "Mật khẩu, mật mã", "Password, PIN code", "Danh từ", 19, [("请不要泄露您的银行卡密码。", "Qǐng bú yào xièlòu nín de yínhángkǎ mìmǎ.", "Xin đừng tiết lộ mật khẩu thẻ ngân hàng của quý khách.", "Please do not leak your bank card password.")]),
    ("现金", "現金", "xiànjīn", "xian jin", "hiện kim", "Tiền mặt", "Cash", "Danh từ", 16, [("这家店也可以使用现金结账。", "Zhè jiā diàn yě kěyǐ shǐyòng xiànjīn jiézhàng.", "Cửa tiệm này cũng có thể dùng tiền mặt thanh toán.", "This shop also accepts cash for checkout.")]),
    ("售货员", "售貨員", "shòuhuòyuán", "shou huo yuan", "thụ hóa viên", "Nhân viên bán hàng", "Salesperson, shop assistant", "Danh từ", 29, [("商场的售货员服务态度很好。", "Shāngchǎng de shòuhuòyuán fúwù tàidu hěn hǎo.", "Nhân viên bán hàng trung tâm thương mại phục vụ rất tốt.", "The mall salesperson's service attitude is very good.")]),
    ("观众", "觀眾", "guānzhòng", "guan zhong", "quan chúng", "Khán giả, người xem", "Audience, spectator", "Danh từ", 12, [("演出结束后，观众们热烈鼓掌。", "Yǎnchū jiéshù hòu, guānzhòngmen rèliè gǔzhǎng.", "Buổi biểu diễn kết thúc, khán giả vỗ tay nhiệt liệt.", "After the performance ended, audience clapped warmly.")]),
    ("记者", "記者", "jìzhě", "ji zhe", "ký giả", "Phóng viên, nhà báo", "Reporter, journalist", "Danh từ", 14, [("记者正在现场进行实时报道。", "Jìzhě zhèngzài xiànchǎng jìnxíng shíshí bàodào.", "Phóng viên đang tường thuật trực tiếp tại hiện trường.", "The reporter is reporting live at the scene.")]),
    ("演员", "演員", "yǎnyuán", "yan yuan", "diễn viên", "Diễn viên nghệ thuật", "Actor, actress", "Danh từ", 19, [("这位老演员的演技非常精湛。", "Zhè wèi lǎo yǎnyuán de yǎnjì fēicháng jīngzhàn.", "Kỹ năng diễn xuất của diễn viên gạo cội này rất điêu luyện.", "This senior actor's acting skills are exquisite.")]),
    ("师傅", "師傅", "shīfu", "shi fu", "sư phụ", "Bác tài, thầy thợ lành nghề", "Master, skilled craftsman", "Danh từ", 22, [("修车的师傅技术很熟练。", "Xiūchē de shīfu jìshù hěn shúliàn.", "Bác thợ sửa xe tay nghề rất thành thạo.", "The car repair master's skill is very proficient.")]),
    ("亲戚", "親戚", "qīnqi", "qin qi", "thân thích", "Bà con, họ hàng thân thích", "Relative, kin", "Danh từ", 23, [("过年时一家人走亲戚拜年。", "Guònián shí yì jiā rén zǒu qīnqi bàinián.", "Dịp Tết cả nhà đi chúc Tết bà con họ hàng.", "During New Year the family visits relatives to wish happy new year.")]),
    ("友谊", "友誼", "yǒuyì", "you yi", "hữu nghị", "Tình bạn, tình hữu nghị", "Friendship", "Danh từ", 16, [("愿我们的友谊地久天长。", "Yuàn wǒmen de yǒuyì dìjiǔtiāncháng.", "Nguyện cho tình bạn của chúng ta bền lâu mãi mãi.", "May our friendship last forever.")]),
]

def generate_hsk4():
    seen = set()
    items = []
    idx = 1
    for row in HSK4_RAW:
        simp, trad, py, clean, hv, vi, en, pos, strokes, exs = row
        if simp in seen:
            continue
        seen.add(simp)
        item = {
            "hsk_level": 4,
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
    items = generate_hsk4()
    print(f"Total Unique HSK 4: {len(items)}")
    with open("/home/admin1/hskde/backend/app/data/hsk4_vocab.py", "w", encoding="utf-8") as f:
        f.write("# HSK 4 Authentic Vocabulary Dataset (80+ entries)\n")
        f.write("HSK4_VOCAB = ")
        f.write(pprint.pformat(items, indent=4, width=120, compact=False))
        f.write("\n")
    print("Written /home/admin1/hskde/backend/app/data/hsk4_vocab.py successfully!")
