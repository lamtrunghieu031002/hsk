import pprint

def build_exam_data():
    exams = [
        # ================= HSK 1 EXAM 1 =================
        {
            "hsk_level": 1,
            "title": "Đề Thi Mô Phỏng Chuẩn HSK 1 (Mock Test #01)",
            "description": "Đề thi kiểm tra kiến thức cơ bản HSK 1 gồm phần Nghe và Đọc hiểu phản xạ.",
            "duration_minutes": 35,
            "total_score": 100,
            "questions": [
                {
                    "section": "listening",
                    "question_number": 1,
                    "question_type": "true_false",
                    "audio_text": "他在喝茶。",
                    "stimulus": "Hình ảnh: Một người đàn ông đang cầm cốc trà uống.",
                    "question_text": "Nghe câu thoại và xác định Đúng hay Sai theo nội dung hình ảnh:",
                    "options": ["Đúng (正确)", "Sai (错误)"],
                    "correct_answer": "Đúng (正确)",
                    "explanation_vi": "Câu thoại đọc là: '他在喝茶' (Anh ấy đang uống trà). Hoàn toàn khớp với nội dung."
                },
                {
                    "section": "listening",
                    "question_number": 2,
                    "question_type": "true_false",
                    "audio_text": "飞机起飞了。",
                    "stimulus": "Hình ảnh: Một chiếc xe taxi đang chạy trên đường phố.",
                    "question_text": "Nghe câu thoại và xác định Đúng hay Sai:",
                    "options": ["Đúng (正确)", "Sai (错误)"],
                    "correct_answer": "Sai (错误)",
                    "explanation_vi": "Câu thoại đọc: '飞机起飞了' (Máy bay cất cánh rồi), nhưng hình ảnh là xe taxi (出租车)."
                },
                {
                    "section": "listening",
                    "question_number": 3,
                    "question_type": "multiple_choice",
                    "audio_text": "你想吃点儿什么？我想吃米饭和中国菜。",
                    "stimulus": "Đối thoại giữa hai người bạn tại nhà ăn.",
                    "question_text": "Người nam muốn ăn món gì?",
                    "options": ["A. 米饭和中国菜", "B. 苹果和西瓜", "C. 面条和鸡蛋", "D. 面包和牛奶"],
                    "correct_answer": "A. 米饭和中国菜",
                    "explanation_vi": "Trong câu thoại người nam trả lời rõ: '我想吃米饭和中国菜' (Tôi muốn ăn cơm và món Trung Quốc)."
                },
                {
                    "section": "listening",
                    "question_number": 4,
                    "question_type": "multiple_choice",
                    "audio_text": "请问，现在几点了？现在上午九点十分。",
                    "stimulus": "Hỏi thời gian hiện tại.",
                    "question_text": "Bây giờ là mấy giờ?",
                    "options": ["A. 8点10分", "B. 9点10分", "C. 9点50分", "D. 10点"],
                    "correct_answer": "B. 9点10分",
                    "explanation_vi": "Câu thoại nêu rõ: '现在上午九点十分' (Bây giờ là 9 giờ 10 phút sáng)."
                },
                {
                    "section": "listening",
                    "question_number": 5,
                    "question_type": "multiple_choice",
                    "audio_text": "王老师在学校工作吗？是的，她是我们的汉语老师。",
                    "stimulus": "Hỏi về nghề nghiệp và nơi làm việc của cô Vương.",
                    "question_text": "Cô Vương làm nghề gì?",
                    "options": ["A. 医生", "B. 汉语老师", "C. 出租车司机", "D. 学生"],
                    "correct_answer": "B. 汉语老师",
                    "explanation_vi": "Câu thoại nói: '她是我们的汉语老师' (Cô ấy là giáo viên tiếng Trung của chúng tôi)."
                },
                {
                    "section": "reading",
                    "question_number": 6,
                    "question_type": "multiple_choice",
                    "stimulus": "A: 很高兴认识你！\nB: _________。",
                    "question_text": "Chọn câu đáp lại thích hợp nhất:",
                    "options": ["A. 我也很高兴", "B. 没关系", "C. 再见", "D. 不客气"],
                    "correct_answer": "A. 我也很高兴",
                    "explanation_vi": "Đáp lại lời chào '很高兴认识你' (Rất vui quen bạn), chuẩn giao tiếp lịch sự là '我也很高兴' (Tôi cũng rất vui)."
                },
                {
                    "section": "reading",
                    "question_number": 7,
                    "question_type": "multiple_choice",
                    "stimulus": "桌子上有三本书和一个水杯。",
                    "question_text": "桌子上有几本书？",
                    "options": ["A. 一本", "B. 两本", "C. 三本", "D. 四本"],
                    "correct_answer": "C. 三本",
                    "explanation_vi": "Câu văn nêu rõ: '桌子上有三本书' (Trên bàn có 3 quyển sách)."
                },
                {
                    "section": "reading",
                    "question_number": 8,
                    "question_type": "multiple_choice",
                    "stimulus": "李明是我的好朋友，他家有四________人。",
                    "question_text": "Chọn lượng từ thích hợp điền vào chỗ trống:",
                    "options": ["A. 个", "B. 口", "C. 只", "D. 本"],
                    "correct_answer": "B. 口",
                    "explanation_vi": "Lượng từ chỉ số nhân khẩu trong gia đình chuẩn tiếng Hán là '口' (四口人)."
                },
                {
                    "section": "reading",
                    "question_number": 9,
                    "question_type": "multiple_choice",
                    "stimulus": "今天天气太热了，我想喝________水。",
                    "question_text": "Điền từ thích hợp vào chỗ trống:",
                    "options": ["A. 点儿", "B. 杯", "C. 块", "D. 本"],
                    "correct_answer": "A. 点儿",
                    "explanation_vi": "'喝点儿水' nghĩa là uống một chút nước, cấu trúc Động từ + 点儿 + Danh từ không đếm được."
                },
                {
                    "section": "reading",
                    "question_number": 10,
                    "question_type": "multiple_choice",
                    "stimulus": "A: 谢谢你的帮助！\nB: _________。",
                    "question_text": "Đáp lại lời cảm ơn chuẩn nhất:",
                    "options": ["A. 不客气", "B. 对不起", "C. 再见", "D. 我也是"],
                    "correct_answer": "A. 不客气",
                    "explanation_vi": "Khi được cảm ơn '谢谢你', đáp lại chuẩn là '不客气' (Không có chi, đừng khách sáo)."
                }
            ]
        },

        # ================= HSK 1 EXAM 2 =================
        {
            "hsk_level": 1,
            "title": "Đề Thi Mô Phỏng Chuẩn HSK 1 (Mock Test #02)",
            "description": "Bộ đề thi thực chiến HSK 1 số 2 rèn luyện từ vựng số đếm, gia đình và địa điểm.",
            "duration_minutes": 35,
            "total_score": 100,
            "questions": [
                {
                    "section": "listening",
                    "question_number": 1,
                    "question_type": "true_false",
                    "audio_text": "今天天气很冷，在下雨。",
                    "stimulus": "Hình ảnh: Trời mưa to và mọi người mặc áo ấm cầm ô.",
                    "question_text": "Nghe và xác nhận nội dung đúng hay sai:",
                    "options": ["Đúng (正确)", "Sai (错误)"],
                    "correct_answer": "Đúng (正确)",
                    "explanation_vi": "Câu thoại: '今天天气很冷，在下雨' (Hôm nay trời rất lạnh, đang mưa), khớp hoàn toàn với hình ảnh."
                },
                {
                    "section": "listening",
                    "question_number": 2,
                    "question_type": "true_false",
                    "audio_text": "我看见那只小猫在睡觉。",
                    "stimulus": "Hình ảnh: Một chú chó to đang chạy ngoài sân.",
                    "question_text": "Nghe và xác nhận đúng hay sai:",
                    "options": ["Đúng (正确)", "Sai (错误)"],
                    "correct_answer": "Sai (错误)",
                    "explanation_vi": "Câu thoại nói về con mèo đang ngủ (小猫在睡觉), trong khi ảnh là con chó (大狗)."
                },
                {
                    "section": "listening",
                    "question_number": 3,
                    "question_type": "multiple_choice",
                    "audio_text": "请问李先生在吗？他在医院工作，还没回家。",
                    "stimulus": "Hỏi về nơi chốn của ông Lý.",
                    "question_text": "Ông Lý đang ở đâu?",
                    "options": ["A. 学校", "B. 医院", "C. 家里", "D. 饭馆"],
                    "correct_answer": "B. 医院",
                    "explanation_vi": "Người trả lời nói: '他在医院工作' (Ông ấy làm việc ở bệnh viện)."
                },
                {
                    "section": "listening",
                    "question_number": 4,
                    "question_type": "multiple_choice",
                    "audio_text": "这个苹果多少钱一斤？三块钱一斤。",
                    "stimulus": "Hỏi giá hoa quả.",
                    "question_text": "Một cân táo giá bao nhiêu tiền?",
                    "options": ["A. 两块", "B. 三块", "C. 五块", "D. 十块"],
                    "correct_answer": "B. 三块",
                    "explanation_vi": "Người bán hàng trả lời: '三块钱一斤' (3 đồng một cân)."
                },
                {
                    "section": "listening",
                    "question_number": 5,
                    "question_type": "multiple_choice",
                    "audio_text": "明天星期六，我们一起去看电影好吗？太好了！",
                    "stimulus": "Hai bạn hẹn nhau ngày mai.",
                    "question_text": "Họ dự định ngày mai làm gì?",
                    "options": ["A. 去看电影", "B. 去买东西", "C. 去学校上课", "D. 在家睡觉"],
                    "correct_answer": "A. 去看电影",
                    "explanation_vi": "Lời rủ: '我们一起去看电影好吗？' (Chúng mình cùng đi xem phim nhé)."
                },
                {
                    "section": "reading",
                    "question_number": 6,
                    "question_type": "multiple_choice",
                    "stimulus": "我爸爸今年四十五岁，他是________。",
                    "question_text": "Chọn danh từ chỉ nghề nghiệp hợp lý:",
                    "options": ["A. 医生", "B. 水果", "C. 电脑", "D. 飞机"],
                    "correct_answer": "A. 医生",
                    "explanation_vi": "'医生' (Bác sĩ) là từ chỉ nghề nghiệp duy nhất trong các phương án."
                },
                {
                    "section": "reading",
                    "question_number": 7,
                    "question_type": "multiple_choice",
                    "stimulus": "昨天上午我在家________睡觉。",
                    "question_text": "Điền giới từ hoặc từ liên kết thích hợp:",
                    "options": ["A. 里", "B. 上", "C. 和", "D. 的"],
                    "correct_answer": "A. 里",
                    "explanation_vi": "'在家里的' hoặc '在家里' (ở trong nhà), '家' thường đi với phương vị từ '里'."
                },
                {
                    "section": "reading",
                    "question_number": 8,
                    "question_type": "multiple_choice",
                    "stimulus": "桌子上的那个杯子是________的？",
                    "question_text": "Điền đại từ nghi vấn hỏi về người sở hữu:",
                    "options": ["A. 谁", "B. 什么", "C. 哪儿", "D. 怎么"],
                    "correct_answer": "A. 谁",
                    "explanation_vi": "Cấu trúc hỏi sở hữu: '谁的' (Của ai?)."
                },
                {
                    "section": "reading",
                    "question_number": 9,
                    "question_type": "multiple_choice",
                    "stimulus": "北京的天气很冷，你要多穿一点儿________。",
                    "question_text": "Chọn danh từ thích hợp:",
                    "options": ["A. 衣服", "B. 苹果", "C. 名字", "D. 朋友"],
                    "correct_answer": "A. 衣服",
                    "explanation_vi": "'穿衣服' (Mặc quần áo) là kết hợp từ tự nhiên duy nhất."
                },
                {
                    "section": "reading",
                    "question_number": 10,
                    "question_type": "multiple_choice",
                    "stimulus": "A: 对不起，我迟到了。\nB: _________。",
                    "question_text": "Đáp lại lời xin lỗi:",
                    "options": ["A. 没关系", "B. 不客气", "C. 很好", "D. 谢谢"],
                    "correct_answer": "A. 没关系",
                    "explanation_vi": "Khi ai đó nói '对不起' (Xin lỗi), câu đáp chuẩn luôn là '没关系' (Không sao đâu)."
                }
            ]
        },

        # ================= HSK 2 EXAM 1 =================
        {
            "hsk_level": 2,
            "title": "Đề Thi Mô Phỏng Chuẩn HSK 2 (Mock Test #01)",
            "description": "Đề thi đánh giá kỹ năng giao tiếp cơ bản, câu so sánh的比 và thói quen sinh hoạt HSK 2.",
            "duration_minutes": 50,
            "total_score": 100,
            "questions": [
                {
                    "section": "listening",
                    "question_number": 1,
                    "question_type": "multiple_choice",
                    "audio_text": "喂，你到车站了吗？我已经到了，正在买火车票呢。",
                    "stimulus": "Cuộc gọi thoại tại bến tàu.",
                    "question_text": "Người nói đang làm gì ở bến tàu?",
                    "options": ["A. 买火车票", "B. 等公共汽车", "C. 喝咖啡", "D. 找钥匙"],
                    "correct_answer": "A. 买火车票",
                    "explanation_vi": "Câu thoại nói: '正在买火车票呢' (Đang mua vé tàu hỏa)."
                },
                {
                    "section": "listening",
                    "question_number": 2,
                    "question_type": "multiple_choice",
                    "audio_text": "你感冒发烧了，要记得按时吃药，今天别去上班了。",
                    "stimulus": "Lời dặn của người thân khi bị ốm.",
                    "question_text": "Người nghe được khuyên nên làm gì?",
                    "options": ["A. 别去上班，按时吃药", "B. 去跑步锻炼", "C. 去电影院看电影", "D. 去超市买菜"],
                    "correct_answer": "A. 别去上班，按时吃药",
                    "explanation_vi": "Khuyên nhủ: '要记得按时吃药，今天别去上班了'."
                },
                {
                    "section": "listening",
                    "question_number": 3,
                    "question_type": "multiple_choice",
                    "audio_text": "小明今天怎么没来踢足球？他生病住院了。",
                    "stimulus": "Hỏi thăm lý do vắng mặt của Tiểu Minh.",
                    "question_text": "Vì sao Tiểu Minh hôm nay không đi đá bóng?",
                    "options": ["A. 生病住院了", "B. 去旅游了", "C. 要准备考试", "D. 正在睡懒觉"],
                    "correct_answer": "A. 生病住院了",
                    "explanation_vi": "Đáp lại rõ: '他生病住院了' (Cậu ấy bị bệnh nằm viện rồi)."
                },
                {
                    "section": "listening",
                    "question_number": 4,
                    "question_type": "multiple_choice",
                    "audio_text": "服务员，我们这桌还要两杯热牛奶和一个鸡蛋。",
                    "stimulus": "Gọi thêm món tại nhà hàng.",
                    "question_text": "Khách hàng gọi thêm đồ ăn đồ uống gì?",
                    "options": ["A. 两杯热牛奶和一个鸡蛋", "B. 两瓶啤酒和一盘羊肉", "C. 一杯咖啡和一个苹果", "D. 两碗面条"],
                    "correct_answer": "A. 两杯热牛奶和一个鸡蛋",
                    "explanation_vi": "Lời gọi món: '还要两杯热牛奶和一个鸡蛋'."
                },
                {
                    "section": "listening",
                    "question_number": 5,
                    "question_type": "multiple_choice",
                    "audio_text": "从你家到公司要多长时间？坐地铁大概半个小时。",
                    "stimulus": "Hỏi thời gian di chuyển đi làm.",
                    "question_text": "Đi tàu điện ngầm từ nhà đến công ty mất bao lâu?",
                    "options": ["A. 15分钟", "B. 半个小时（30分钟）", "C. 一个小时", "D. 两个小时"],
                    "correct_answer": "B. 半个小时（30分钟）",
                    "explanation_vi": "'半个小时' tức là nửa tiếng đồng hồ (30 phút)."
                },
                {
                    "section": "reading",
                    "question_number": 6,
                    "question_type": "multiple_choice",
                    "stimulus": "今天的天气真好，外面很暖和，我们一起去公园________吧。",
                    "question_text": "Chọn động từ thích hợp:",
                    "options": ["A. 跑步", "B. 睡觉", "C. 生病", "D. 穿衣服"],
                    "correct_answer": "A. 跑步",
                    "explanation_vi": "Thời tiết đẹp đi công viên chạy bộ tập thể dục ('跑步') là hợp nghĩa nhất."
                },
                {
                    "section": "reading",
                    "question_number": 7,
                    "question_type": "multiple_choice",
                    "stimulus": "哥哥比弟弟高________。",
                    "question_text": "Chọn từ bổ ngữ cho câu so sánh的比:",
                    "options": ["A. 很", "B. 一点儿", "C. 非常", "D. 太"],
                    "correct_answer": "B. 一点儿",
                    "explanation_vi": "Trong câu so sánh 比, không dùng 很/非常/太 đứng trước hoặc sau tính từ, mà dùng '一点儿' hoặc '得多' ở sau tính từ."
                },
                {
                    "section": "reading",
                    "question_number": 8,
                    "question_type": "multiple_choice",
                    "stimulus": "这件衣服虽然颜色好看，________价格太贵了。",
                    "question_text": "Điền liên từ nối câu nhượng bộ 虽然:",
                    "options": ["A. 但是", "B. 所以", "C. 因为", "D. 而且"],
                    "correct_answer": "A. 但是",
                    "explanation_vi": "Cặp liên từ cố định: '虽然...但是...' (Tuy... nhưng...)."
                },
                {
                    "section": "reading",
                    "question_number": 9,
                    "question_type": "multiple_choice",
                    "stimulus": "下周一有汉语考试，你________好了吗？",
                    "question_text": "Điền động từ thích hợp:",
                    "options": ["A. 准备", "B. 介绍", "C. 帮助", "D. 告诉"],
                    "correct_answer": "A. 准备",
                    "explanation_vi": "Cụm từ chuẩn: '准备好了吗？' (Đã chuẩn bị xong chưa?)."
                },
                {
                    "section": "reading",
                    "question_number": 10,
                    "question_type": "multiple_choice",
                    "stimulus": "教室里安静得很，同学们正在认真地________。",
                    "question_text": "Điền cụm từ phù hợp ngữ cảnh lớp học:",
                    "options": ["A. 做题看书", "B. 踢足球", "C. 跳舞唱歌", "D. 睡觉洗澡"],
                    "correct_answer": "A. 做题看书",
                    "explanation_vi": "Trong lớp học yên tĩnh, học sinh đang chăm chỉ '做题看书' (làm bài tập đọc sách)."
                }
            ]
        },

        # ================= HSK 2 EXAM 2 =================
        {
            "hsk_level": 2,
            "title": "Đề Thi Mô Phỏng Chuẩn HSK 2 (Mock Test #02)",
            "description": "Đề kiểm tra HSK 2 chuyên sâu về phương vị từ, trợ từ động thái 着/过 và ngữ cảnh mua sắm.",
            "duration_minutes": 50,
            "total_score": 100,
            "questions": [
                {
                    "section": "listening",
                    "question_number": 1,
                    "question_type": "multiple_choice",
                    "audio_text": "西瓜多少钱一公斤？五块钱一公斤，保甜！",
                    "stimulus": "Mua hoa quả ở chợ.",
                    "question_text": "Dưa hấu giá bao nhiêu 1 kg?",
                    "options": ["A. 3元", "B. 5元", "C. 8元", "D. 10元"],
                    "correct_answer": "B. 5元",
                    "explanation_vi": "Người bán trả lời: '五块钱一公斤' (5 đồng một kg)."
                },
                {
                    "section": "listening",
                    "question_number": 2,
                    "question_type": "multiple_choice",
                    "audio_text": "你看，门开着呢，王经理肯定在办公室里。",
                    "stimulus": "Nhận biết trạng thái văn phòng qua cánh cửa.",
                    "question_text": "Vì sao họ biết Giám đốc Vương đang ở trong phòng?",
                    "options": ["A. 因为门开着", "B. 因为听到了电话声", "C. 因为灯亮着", "D. 因为看见了他的车"],
                    "correct_answer": "A. 因为门开着",
                    "explanation_vi": "Câu nói chỉ rõ: '你看，门开着呢' (Cậu xem, cửa đang mở kìa)."
                },
                {
                    "section": "listening",
                    "question_number": 3,
                    "question_type": "multiple_choice",
                    "audio_text": "你去过中国吗？我去过一次北京和上海。",
                    "stimulus": "Hỏi về kinh nghiệm đi Trung Quốc.",
                    "question_text": "Người được hỏi đã từng đi những đâu ở Trung Quốc?",
                    "options": ["A. 北京和上海", "B. 广州和深圳", "C. 香港和澳门", "D. 还没去过"],
                    "correct_answer": "A. 北京和上海",
                    "explanation_vi": "Người đó nói: '我去过一次北京和上海'."
                },
                {
                    "section": "listening",
                    "question_number": 4,
                    "question_type": "multiple_choice",
                    "audio_text": "大夫，我的眼睛有点红，还很疼。别揉，我给你开点眼药水。",
                    "stimulus": "Khám mắt tại bệnh viện.",
                    "question_text": "Bác sĩ đã làm gì cho bệnh nhân?",
                    "options": ["A. 开了眼药水", "B. 让他马上住院", "C. 让他多跑步", "D. 给他打了针"],
                    "correct_answer": "A. 开了眼药水",
                    "explanation_vi": "Bác sĩ nói: '我给你开点眼药水' (Tôi kê cho bạn ít thuốc nhỏ mắt)."
                },
                {
                    "section": "listening",
                    "question_number": 5,
                    "question_type": "multiple_choice",
                    "audio_text": "服务员，买单。一共是一百二十元，现金还是刷卡？",
                    "stimulus": "Thanh toán bữa ăn.",
                    "question_text": "Bữa ăn hết tổng cộng bao nhiêu tiền?",
                    "options": ["A. 100元", "B. 120元", "C. 200元", "D. 150元"],
                    "correct_answer": "B. 120元",
                    "explanation_vi": "Phục vụ thông báo: '一共是一百二十元' (Tổng cộng 120 tệ)."
                },
                {
                    "section": "reading",
                    "question_number": 6,
                    "question_type": "multiple_choice",
                    "stimulus": "银行就在超市的________，走过马路就是。",
                    "question_text": "Chọn từ chỉ phương vị thích hợp:",
                    "options": ["A. 对面", "B. 里面", "C. 以前", "D. 以后"],
                    "correct_answer": "A. 对面",
                    "explanation_vi": "'走过马路就是' (Băng qua đường là tới), nên vị trí là '对面' (đối diện)."
                },
                {
                    "section": "reading",
                    "question_number": 7,
                    "question_type": "multiple_choice",
                    "stimulus": "妹妹唱歌唱得真________，大家都在鼓掌。",
                    "question_text": "Chọn tính từ khen ngợi thích hợp sau bổ ngữ 得:",
                    "options": ["A. 好听", "B. 便宜", "C. 难看", "D. 饱"],
                    "correct_answer": "A. 好听",
                    "explanation_vi": "Khen tiếng hát của em gái: '唱歌唱得真好听' (Hát thật là hay)."
                },
                {
                    "section": "reading",
                    "question_number": 8,
                    "question_type": "multiple_choice",
                    "stimulus": "________天气很冷，但是教室里很暖和。",
                    "question_text": "Điền liên từ thích hợp:",
                    "options": ["A. 虽然", "B. 因为", "C. 所以", "D. 如果"],
                    "correct_answer": "A. 虽然",
                    "explanation_vi": "Cặp liên từ '虽然...但是...' đi liền với nhau."
                },
                {
                    "section": "reading",
                    "question_number": 9,
                    "question_type": "multiple_choice",
                    "stimulus": "快穿好衣服，电影________就要开始了！",
                    "question_text": "Điền phó từ biểu thị sắp sửa xảy ra:",
                    "options": ["A. 马上", "B. 已经", "C. 曾经", "D. 经常"],
                    "correct_answer": "A. 马上",
                    "explanation_vi": "'马上就要...了' biểu thị hành động sắp xảy ra ngay tức khắc."
                },
                {
                    "section": "reading",
                    "question_number": 10,
                    "question_type": "multiple_choice",
                    "stimulus": "这道题我看了半天也没弄________，你能给我讲讲吗？",
                    "question_text": "Điền bổ ngữ kết quả:",
                    "options": ["A. 懂", "B. 走", "C. 错", "D. 累"],
                    "correct_answer": "A. 懂",
                    "explanation_vi": "'弄懂' nghĩa là hiểu rõ ngọn ngành vấn đề."
                }
            ]
        },

        # ================= HSK 3 EXAM 1 =================
        {
            "hsk_level": 3,
            "title": "Đề Thi Mô Phỏng Chuẩn HSK 3 (Mock Test #01)",
            "description": "Luyện tập câu chữ 把, câu chữ 被, bổ ngữ xu hướng và đọc hiểu văn bản trung cấp.",
            "duration_minutes": 85,
            "total_score": 300,
            "questions": [
                {
                    "section": "listening",
                    "question_number": 1,
                    "question_type": "multiple_choice",
                    "audio_text": "请大家在考试前把手机关上，放在前面的桌子上。",
                    "stimulus": "Thông báo quy chế phòng thi.",
                    "question_text": "Trước khi thi thí sinh được yêu cầu làm gì với điện thoại?",
                    "options": ["A. 把手机关上并放在前桌", "B. 拿出手机查字典", "C. 把手机借给同学", "D. 调成振动放在口袋里"],
                    "correct_answer": "A. 把手机关上并放在前桌",
                    "explanation_vi": "Giám thị nhắc: '把手机关上，放在前面的桌子上'."
                },
                {
                    "section": "listening",
                    "question_number": 2,
                    "question_type": "multiple_choice",
                    "audio_text": "外面下大雨了，你先把雨伞拿进去，别把地板弄湿了。",
                    "stimulus": "Nhắc nhở khi trời mưa về nhà.",
                    "question_text": "Người nói lo lắng điều gì?",
                    "options": ["A. 担心地板被弄湿", "B. 担心雨伞丢了", "C. 担心感冒发烧", "D. 担心衣服脏了"],
                    "correct_answer": "A. 担心地板被弄湿",
                    "explanation_vi": "Lời dặn: '别把地板弄湿了' (Đừng làm ướt sàn nhà)."
                },
                {
                    "section": "listening",
                    "question_number": 3,
                    "question_type": "multiple_choice",
                    "audio_text": "你好，我想换两千块人民币，请问需要出示护照吗？是的先生，请给我您的护照。",
                    "stimulus": "Giao dịch đổi tiền tại quầy ngân hàng.",
                    "question_text": "Khách hàng muốn làm gì?",
                    "options": ["A. 换两千块人民币", "B. 办理信用卡", "C. 买两张飞机票", "D. 取五千块现金"],
                    "correct_answer": "A. 换两千块人民币",
                    "explanation_vi": "Khách nói rõ: '我想换两千块人民币'."
                },
                {
                    "section": "listening",
                    "question_number": 4,
                    "question_type": "multiple_choice",
                    "audio_text": "会议室的空调坏了，今天太热了，大家去三楼的大会议室开会吧。",
                    "stimulus": "Thông báo đổi địa điểm họp.",
                    "question_text": "Vì sao phải đổi phòng họp lên tầng 3?",
                    "options": ["A. 因为这间空调坏了太热", "B. 因为三楼人更多", "C. 因为三楼有水果点心", "D. 因为经理不在"],
                    "correct_answer": "A. 因为这间空调坏了太热",
                    "explanation_vi": "Lý do: '会议室的空调坏了，今天太热了'."
                },
                {
                    "section": "listening",
                    "question_number": 5,
                    "question_type": "multiple_choice",
                    "audio_text": "周末我们全家一起去郊外爬山，环境好极了，空气特别新鲜。",
                    "stimulus": "Kể về chuyến đi chơi cuối tuần của cả gia đình.",
                    "question_text": "Họ đã làm gì vào dịp cuối tuần?",
                    "options": ["A. 全家去郊外爬山", "B. 去电影院看电影", "C. 在家大扫除", "D. 去超市买东西"],
                    "correct_answer": "A. 全家去郊外爬山",
                    "explanation_vi": "Nói rõ: '周末我们全家一起去郊外爬山'."
                },
                {
                    "section": "reading",
                    "question_number": 6,
                    "question_type": "multiple_choice",
                    "stimulus": "遇到困难时，只要我们不放弃，就一定能找到________问题的办法。",
                    "question_text": "Chọn động từ thích hợp đi với '问题':",
                    "options": ["A. 解决", "B. 发生", "C. 遇到", "D. 出现"],
                    "correct_answer": "A. 解决",
                    "explanation_vi": "'解决问题' (giải quyết vấn đề) là cụm động tân cố định chuẩn mực."
                },
                {
                    "section": "reading",
                    "question_number": 7,
                    "question_type": "multiple_choice",
                    "stimulus": "他越说越激动，声音也________大了起来。",
                    "question_text": "Điền phó từ thích hợp:",
                    "options": ["A. 越来越", "B. 已经", "C. 马上", "D. 几乎"],
                    "correct_answer": "A. 越来越",
                    "explanation_vi": "Cấu trúc '越来越 + Tính từ' biểu thị mức độ tăng dần theo thời gian."
                },
                {
                    "section": "reading",
                    "question_number": 8,
                    "question_type": "multiple_choice",
                    "stimulus": "桌上的那块蛋糕被贪吃的弟弟________了。",
                    "question_text": "Chọn vị ngữ câu chữ 被:",
                    "options": ["A. 吃光", "B. 喝完", "C. 走开", "D. 关上"],
                    "correct_answer": "A. 吃光",
                    "explanation_vi": "Bánh ngọt (蛋糕) thì phải là ăn hết sạch ('吃光')."
                },
                {
                    "section": "reading",
                    "question_number": 9,
                    "question_type": "multiple_choice",
                    "stimulus": "每天坚持阅读半小时，对________汉语阅读水平很有帮助。",
                    "question_text": "Điền động từ thích hợp đi với '水平':",
                    "options": ["A. 提高", "B. 增加", "C. 减少", "D. 扩大"],
                    "correct_answer": "A. 提高",
                    "explanation_vi": "'提高水平' (nâng cao trình độ) là kết hợp từ chuẩn."
                },
                {
                    "section": "reading",
                    "question_number": 10,
                    "question_type": "multiple_choice",
                    "stimulus": "请大家按顺序排队，一个________一个地上车。",
                    "question_text": "Điền liên từ trong thành ngữ tuần tự:",
                    "options": ["A. 接", "B. 跟", "C. 和", "D. 同"],
                    "correct_answer": "A. 接",
                    "explanation_vi": "'一个接一个' nghĩa là từng người một nối tiếp nhau."
                }
            ]
        },

        # ================= HSK 3 EXAM 2 =================
        {
            "hsk_level": 3,
            "title": "Đề Thi Mô Phỏng Chuẩn HSK 3 (Mock Test #02)",
            "description": "Kiểm tra kỹ năng phân tích đoạn văn đọc hiểu, ngữ pháp 除了...以外 và từ nối HSK 3.",
            "duration_minutes": 85,
            "total_score": 300,
            "questions": [
                {
                    "section": "listening",
                    "question_number": 1,
                    "question_type": "multiple_choice",
                    "audio_text": "真不好意思，路上突然遇到了堵车，我迟到了十分钟。",
                    "stimulus": "Giải thích lý do đến muộn.",
                    "question_text": "Vì sao người nói lại đến muộn 10 phút?",
                    "options": ["A. 路上堵车", "B. 睡过头了", "C. 找不到钱包", "D. 生病去医院"],
                    "correct_answer": "A. 路上堵车",
                    "explanation_vi": "Người nói giải thích: '路上突然遇到了堵车' (Trên đường đột nhiên bị kẹt xe)."
                },
                {
                    "section": "listening",
                    "question_number": 2,
                    "question_type": "multiple_choice",
                    "audio_text": "服务员，这盘鱼的味道太酸了，麻烦帮我们换一盘好吗？",
                    "stimulus": "Phản ánh món ăn tại nhà hàng.",
                    "question_text": "Khách hàng muốn đổi món vì lý do gì?",
                    "options": ["A. 鱼的味道太酸了", "B. 菜太辣了", "C. 菜凉了", "D. 菜里没有盐"],
                    "correct_answer": "A. 鱼的味道太酸了",
                    "explanation_vi": "Khách phàn nàn: '这盘鱼的味道太酸了'."
                },
                {
                    "section": "listening",
                    "question_number": 3,
                    "question_type": "multiple_choice",
                    "audio_text": "借书证办好了，一次最多可以借五本书，借期是一个月。",
                    "stimulus": "Quy định mượn sách thư viện.",
                    "question_text": "Mỗi lần được mượn tối đa mấy quyển sách và trong bao lâu?",
                    "options": ["A. 5本，为期一个月", "B. 3本，为期两周", "C. 10本，为期两个月", "D. 1本，为期一年"],
                    "correct_answer": "A. 5本，为期一个月",
                    "explanation_vi": "Nói rõ: '一次最多可以借五本书，借期是一个月'."
                },
                {
                    "section": "listening",
                    "question_number": 4,
                    "question_type": "multiple_choice",
                    "audio_text": "明天的爬山活动，除了小张生病请假以外，其他人都要参加。",
                    "stimulus": "Thông báo danh sách tham gia hoạt động dã ngoại.",
                    "question_text": "Ai sẽ không tham gia buổi leo núi ngày mai?",
                    "options": ["A. 小张", "B. 老师", "C. 班长", "D. 所有人都不去"],
                    "correct_answer": "A. 小张",
                    "explanation_vi": "'除了小张生病请假以外' (Ngoại trừ Tiểu Trương bị ốm xin nghỉ)."
                },
                {
                    "section": "listening",
                    "question_number": 5,
                    "question_type": "multiple_choice",
                    "audio_text": "这台旧冰箱用了八年了，制冷效果不好，我们买台新的吧。",
                    "stimulus": "Bàn bạc việc mua đồ gia dụng mới.",
                    "question_text": "Họ dự định mua đồ gì mới?",
                    "options": ["A. 新冰箱", "B. 新空调", "C. 新电视", "D. 新电脑"],
                    "correct_answer": "A. 新冰箱",
                    "explanation_vi": "Đang nói về '这台旧冰箱...买台新的吧'."
                },
                {
                    "section": "reading",
                    "question_number": 6,
                    "question_type": "multiple_choice",
                    "stimulus": "他平时工作非常认真，对待同事也特别________。",
                    "question_text": "Chọn tính từ tích cực chỉ thái độ đối đãi mọi người:",
                    "options": ["A. 热情", "B. 奇怪", "C. 饱", "D. 渴"],
                    "correct_answer": "A. 热情",
                    "explanation_vi": "'对待同事也特别热情' (Đối xử với đồng nghiệp vô cùng nhiệt tình)."
                },
                {
                    "section": "reading",
                    "question_number": 7,
                    "question_type": "multiple_choice",
                    "stimulus": "请你把护照和机票准备好，马上就要登机________。",
                    "question_text": "Điền trợ từ hoàn tất:",
                    "options": ["A. 了", "B. 着", "C. 过", "D. 得"],
                    "correct_answer": "A. 了",
                    "explanation_vi": "Cấu trúc sắp sửa xảy ra: '就要...了'."
                },
                {
                    "section": "reading",
                    "question_number": 8,
                    "question_type": "multiple_choice",
                    "stimulus": "只要每天坚持练习听力，你的汉语成绩________会提高。",
                    "question_text": "Điền phó từ khẳng định chắc chắn:",
                    "options": ["A. 一定", "B. 几乎", "C. 突然", "D. 偶尔"],
                    "correct_answer": "A. 一定",
                    "explanation_vi": "'只要...就一定...' (Chỉ cần... thì nhất định sẽ...)."
                },
                {
                    "section": "reading",
                    "question_number": 9,
                    "question_type": "multiple_choice",
                    "stimulus": "图书馆里请保持________，不要大声喧哗。",
                    "question_text": "Chọn tính từ phù hợp không gian thư viện:",
                    "options": ["A. 安静", "B. 方便", "C. 简单", "D. 难"],
                    "correct_answer": "A. 安静",
                    "explanation_vi": "'保持安静' (Giữ gìn yên tĩnh) là quy định thư viện chuẩn."
                },
                {
                    "section": "reading",
                    "question_number": 10,
                    "question_type": "multiple_choice",
                    "stimulus": "他一边喝着热咖啡，一边看着手里的________。",
                    "question_text": "Chọn danh từ hợp lý để đọc:",
                    "options": ["A. 报纸", "B. 雨伞", "C. 筷子", "D. 皮鞋"],
                    "correct_answer": "A. 报纸",
                    "explanation_vi": "Xem báo giấy trong tay ('看着手里的报纸')."
                }
            ]
        },

        # ================= HSK 4 EXAM 1 =================
        {
            "hsk_level": 4,
            "title": "Đề Thi Mô Phỏng Chuẩn HSK 4 (Mock Test #01)",
            "description": "Kiểm tra kỹ năng phân tích logic câu phức, liên từ nâng cao 不仅/即使/既然 và phỏng vấn việc làm.",
            "duration_minutes": 100,
            "total_score": 300,
            "questions": [
                {
                    "section": "listening",
                    "question_number": 1,
                    "question_type": "multiple_choice",
                    "audio_text": "恭喜你顺利通过了最后一轮面试，下周一请带上体检报告来人力资源部办理入职手续。",
                    "stimulus": "Thông báo trúng tuyển việc làm.",
                    "question_text": "Ứng viên cần mang giấy tờ gì đến phòng nhân sự vào thứ Hai tới?",
                    "options": ["A. 体检报告", "B. 毕业证原件", "C. 护照复印件", "D. 银行卡密码"],
                    "correct_answer": "A. 体检报告",
                    "explanation_vi": "Thông báo: '带上体检报告来人力资源部办理入职'."
                },
                {
                    "section": "listening",
                    "question_number": 2,
                    "question_type": "multiple_choice",
                    "audio_text": "不管遇到多大的困难，只要大家齐心协力，我们保证能按时完成这个科研项目。",
                    "stimulus": "Lời phát biểu của trưởng nhóm nghiên cứu.",
                    "question_text": "Trưởng nhóm cam kết điều gì?",
                    "options": ["A. 按时完成科研项目", "B. 给全体员工发奖金", "C. 申请延期交付", "D. 重新招聘新员工"],
                    "correct_answer": "A. 按时完成科研项目",
                    "explanation_vi": "Nói rõ: '保证能按时完成这个科研项目'."
                },
                {
                    "section": "listening",
                    "question_number": 3,
                    "question_type": "multiple_choice",
                    "audio_text": "既然你已经下定决心出国深造，那就趁年轻全力以赴去拼搏吧。",
                    "stimulus": "Lời khuyên nhủ của thầy giáo dành cho học trò.",
                    "question_text": "Thầy giáo có thái độ như thế nào đối với quyết định du học của học trò?",
                    "options": ["A. 支持并鼓励他全力以赴", "B. 坚决反对他出国", "C. 建议他换个专业", "D. 批评他不够慎重"],
                    "correct_answer": "A. 支持并鼓励他全力以赴",
                    "explanation_vi": "Lời khuyên '那就趁年轻全力以赴去拼搏吧' thể hiện sự ủng hộ và khích lệ."
                },
                {
                    "section": "listening",
                    "question_number": 4,
                    "question_type": "multiple_choice",
                    "audio_text": "这部幽默喜剧电影不仅情节引人入胜，而且演员的表演十分出色，获得了观众极高的评价。",
                    "stimulus": "Đánh giá về một bộ phim hài kịch.",
                    "question_text": "Bộ phim nhận được đánh giá cao nhờ những yếu tố nào?",
                    "options": ["A. 情节引人入胜且演员表演优秀", "B. 电影票价便宜", "C. 电影院环境好", "D. 获得了国际大奖"],
                    "correct_answer": "A. 情节引人入胜且演员表演优秀",
                    "explanation_vi": "Nội dung: '不仅情节引人入胜，而且演员的表演十分出色'."
                },
                {
                    "section": "reading",
                    "question_number": 5,
                    "question_type": "multiple_choice",
                    "stimulus": "一个人在职业道路上要想走得长远，光靠聪明是不够的，踏实认真的________才是最关键的基石。",
                    "question_text": "Chọn danh từ thích hợp:",
                    "options": ["A. 态度", "B. 钥匙", "C. 袜子", "D. 塑料袋"],
                    "correct_answer": "A. 态度",
                    "explanation_vi": "'认真的态度' (thái độ nghiêm túc) là nền tảng cốt lõi trong công việc."
                },
                {
                    "section": "reading",
                    "question_number": 6,
                    "question_type": "multiple_choice",
                    "stimulus": "遇到困难时，我们不能轻易放弃，必须学会________。",
                    "question_text": "Chọn động từ biểu thị ý chí kiên định:",
                    "options": ["A. 坚持", "B. 随便", "C. 后悔", "D. 失望"],
                    "correct_answer": "A. 坚持",
                    "explanation_vi": "'坚持' (kiên trì) trái ngược với '轻易放弃' (dễ dàng từ bỏ)."
                },
                {
                    "section": "reading",
                    "question_number": 7,
                    "question_type": "multiple_choice",
                    "stimulus": "现代科学技术的飞速发展，________改变了全球人类的日常生活方式。",
                    "question_text": "Điền phó từ nhấn mạnh mức độ sâu sắc:",
                    "options": ["A. 深刻地", "B. 偶尔地", "C. 随便地", "D. 暂时地"],
                    "correct_answer": "A. 深刻地",
                    "explanation_vi": "'深刻地改变' (thay đổi một cách sâu sắc) là cụm kết hợp cao cấp."
                },
                {
                    "section": "reading",
                    "question_number": 8,
                    "question_type": "multiple_choice",
                    "stimulus": "在商业谈判中，双方如果能够做到互相信任、互利共赢，合作就会十分________。",
                    "question_text": "Chọn tính từ miêu tả sự suôn sẻ thuận lợi:",
                    "options": ["A. 顺利", "B. 害羞", "C. 粗心", "D. 骄傲"],
                    "correct_answer": "A. 顺利",
                    "explanation_vi": "Hợp tác diễn ra '十分顺利' (vô cùng thuận lợi)."
                },
                {
                    "section": "reading",
                    "question_number": 9,
                    "question_type": "multiple_choice",
                    "stimulus": "他工作太投入了，________连外面下大暴雨的声音都没听到。",
                    "question_text": "Điền liên từ tăng tiến cực độ:",
                    "options": ["A. 甚至", "B. 尽管", "C. 既然", "D. 按照"],
                    "correct_answer": "A. 甚至",
                    "explanation_vi": "'甚至连...都...' là cấu trúc nhấn mạnh mức độ tăng tiến tột cùng."
                },
                {
                    "section": "reading",
                    "question_number": 10,
                    "question_type": "multiple_choice",
                    "stimulus": "无论外界环境发生多么复杂的变化，我们________要坚守诚信原则。",
                    "question_text": "Chọn phó từ đi cùng 无论:",
                    "options": ["A. 都", "B. 就", "C. 才", "D. 倒"],
                    "correct_answer": "A. 都",
                    "explanation_vi": "Cấu trúc vô điều kiện: '无论...都...'."
                }
            ]
        },

        # ================= HSK 4 EXAM 2 =================
        {
            "hsk_level": 4,
            "title": "Đề Thi Mô Phỏng Chuẩn HSK 4 (Mock Test #02)",
            "description": "Khảo sát chuyên sâu năng lực từ vựng nghề nghiệp, quy định pháp luật và quan hệ nhân - quả.",
            "duration_minutes": 100,
            "total_score": 300,
            "questions": [
                {
                    "section": "listening",
                    "question_number": 1,
                    "question_type": "multiple_choice",
                    "audio_text": "根据国家法律规定，用人单位必须依法为每一位劳动者按时缴纳社会保险。",
                    "stimulus": "Quy định pháp luật lao động.",
                    "question_text": "Người sử dụng lao động bắt buộc phải làm gì theo luật định?",
                    "options": ["A. 为劳动者按时缴纳社保", "B. 允许员工随时迟到", "C. 每周发放现金工资", "D. 报销一切旅游费用"],
                    "correct_answer": "A. 为劳动者按时缴纳社保",
                    "explanation_vi": "Nói rõ: '依法为每一位劳动者按时缴纳社会保险'."
                },
                {
                    "section": "listening",
                    "question_number": 2,
                    "question_type": "multiple_choice",
                    "audio_text": "他虽然在这次技术竞赛中没有拿到第一名，但是积累了极为宝贵的现场应对经验。",
                    "stimulus": "Nhận xét về kết quả thi đấu tay nghề.",
                    "question_text": "Thí sinh đã thu hoạch được điều gì lớn nhất sau cuộc thi?",
                    "options": ["A. 积累了宝贵的应对经验", "B. 获得了高额奖金", "C. 晋升为部门经理", "D. 决定换一份新工作"],
                    "correct_answer": "A. 积累了宝贵的应对经验",
                    "explanation_vi": "Nêu rõ: '积累了极为宝贵的现场应对经验'."
                },
                {
                    "section": "listening",
                    "question_number": 3,
                    "question_type": "multiple_choice",
                    "audio_text": "请各位观众在演出进行期间，将手机调至静音模式，并且严禁使用闪光灯拍照。",
                    "stimulus": "Quy định của nhà hát kịch.",
                    "question_text": "Khán giả bị nghiêm cấm hành vi nào trong lúc buổi biểu diễn diễn ra?",
                    "options": ["A. 使用闪光灯拍照", "B. 鼓掌喝彩", "C. 坐在自己的座位上", "D. 喝矿泉水"],
                    "correct_answer": "A. 使用闪光灯拍照",
                    "explanation_vi": "Quy định: '严禁使用闪光灯拍照' (Nghiêm cấm dùng đèn flash chụp ảnh)."
                },
                {
                    "section": "listening",
                    "question_number": 4,
                    "question_type": "multiple_choice",
                    "audio_text": "在人际交往中，幽默感往往能巧妙化解尴尬气氛，迅速拉近彼此之间的心理距离。",
                    "stimulus": "Tâm lý học giao tiếp xã hội.",
                    "question_text": "Tính hài hước có tác dụng tích cực gì trong giao tiếp?",
                    "options": ["A. 化解尴尬并拉近心理距离", "B. 让人产生自卑感", "C. 增加工作经济压力", "D. 导致沟通效率下降"],
                    "correct_answer": "A. 化解尴尬并拉近心理距离",
                    "explanation_vi": "Nêu rõ: '巧妙化解尴尬气氛，迅速拉近彼此之间的心理距离'."
                },
                {
                    "section": "reading",
                    "question_number": 5,
                    "question_type": "multiple_choice",
                    "stimulus": "在激烈的市场竞争中，一家企业如果缺乏创新意识，就很容易被时代所________。",
                    "question_text": "Chọn động từ thích hợp:",
                    "options": ["A. 淘汰", "B. 鼓励", "C. 批评", "D. 表扬"],
                    "correct_answer": "A. 淘汰",
                    "explanation_vi": "Doanh nghiệp không chịu đổi mới sẽ bị thời đại đào thải ('被淘汰')."
                },
                {
                    "section": "reading",
                    "question_number": 6,
                    "question_type": "multiple_choice",
                    "stimulus": "做学问必须保持谦虚严谨的学风，容不得半点虚假与________。",
                    "question_text": "Chọn tính từ trái nghĩa với nghiêm cẩn:",
                    "options": ["A. 粗心", "B. 勇敢", "C. 幽默", "D. 诚实"],
                    "correct_answer": "A. 粗心",
                    "explanation_vi": "Nghiên cứu học thuật không chấp nhận sự giả dối và cẩu thả sơ sài ('粗心')."
                },
                {
                    "section": "reading",
                    "question_number": 7,
                    "question_type": "multiple_choice",
                    "stimulus": "________明天的天气多么恶劣，救援队伍都会准时出发前往受灾前线。",
                    "question_text": "Điền liên từ mở đầu câu điều kiện vô điều kiện:",
                    "options": ["A. 无论", "B. 既然", "C. 即使", "D. 按照"],
                    "correct_answer": "A. 无论",
                    "explanation_vi": "'无论...多么...都...' là mẫu câu chuẩn."
                },
                {
                    "section": "reading",
                    "question_number": 8,
                    "question_type": "multiple_choice",
                    "stimulus": "这台设备的性能十分优越，使用寿命长，________维修成本也很低。",
                    "question_text": "Điền liên từ bổ sung vế tăng tiến:",
                    "options": ["A. 并且", "B. 相反", "C. 然而", "D. 可是"],
                    "correct_answer": "A. 并且",
                    "explanation_vi": "'并且' (đồng thời, hơn nữa) liên kết hai ưu điểm đồng cấp của thiết bị."
                },
                {
                    "section": "reading",
                    "question_number": 9,
                    "question_type": "multiple_choice",
                    "stimulus": "经过反复讨论论证，管理层最终一致通过了这项新的员工激励________。",
                    "question_text": "Chọn danh từ thích hợp:",
                    "options": ["A. 方案", "B. 垃圾桶", "C. 钥匙", "D. 塑料袋"],
                    "correct_answer": "A. 方案",
                    "explanation_vi": "'激励方案' (phương án khích lệ/thưởng) là danh từ chuẩn."
                },
                {
                    "section": "reading",
                    "question_number": 10,
                    "question_type": "multiple_choice",
                    "stimulus": "他为人非常低调，取得了那么重大的成就，在大家面前却依然十分________。",
                    "question_text": "Chọn tính từ miêu tả đức tính tốt đẹp:",
                    "options": ["A. 谦虚", "B. 骄傲", "C. 害羞", "D. 随便"],
                    "correct_answer": "A. 谦虚",
                    "explanation_vi": "Đạt thành tựu lớn nhưng vẫn rất khiêm tốn ('谦虚')."
                }
            ]
        },

        # ================= HSK 5 EXAM 1 =================
        {
            "hsk_level": 5,
            "title": "Đề Thi Mô Phỏng Chuẩn HSK 5 (Mock Test #01)",
            "description": "Khảo sát tư duy kinh tế, tầm nhìn vĩ mô - vi mô, thành ngữ và kết cấu liên từ 哪怕...也 / 从而.",
            "duration_minutes": 120,
            "total_score": 300,
            "questions": [
                {
                    "section": "listening",
                    "question_number": 1,
                    "question_type": "multiple_choice",
                    "audio_text": "在激烈的商业博弈中，企业领袖不仅要具备敏锐的市场洞察力，更要懂得统筹兼顾长远社会效益与短期经济回报。",
                    "stimulus": "Bài phát biểu tại diễn đàn quản trị cấp cao.",
                    "question_text": "Người lãnh đạo doanh nghiệp cần có phẩm chất cốt lõi nào?",
                    "options": ["A. 具备敏锐洞察力并统筹长远与短期效益", "B. 只追求短期利润最大化", "C. 完全依赖外部咨询机构决策", "D. 避免承担任何创新风险"],
                    "correct_answer": "A. 具备敏锐洞察力并统筹长远与短期效益",
                    "explanation_vi": "Nội dung: '具备敏锐的市场洞察力，更要懂得统筹兼顾长远社会效益与短期经济回报'."
                },
                {
                    "section": "listening",
                    "question_number": 2,
                    "question_type": "multiple_choice",
                    "audio_text": "随着大数据与云计算技术的全面渗透，传统物流行业的运营模式正在发生深刻的颠覆性重构。",
                    "stimulus": "Báo cáo xu hướng chuyển đổi số ngành hậu cần (logistics).",
                    "question_text": "Ngành logistics truyền thống đang diễn ra sự thay đổi như thế nào?",
                    "options": ["A. 运营模式发生深刻的颠覆性重构", "B. 市场需求出现大幅萎缩", "C. 运输成本居高不下无法解决", "D. 完全退出了历史舞台"],
                    "correct_answer": "A. 运营模式发生深刻的颠覆性重构",
                    "explanation_vi": "Nói rõ: '运营模式正在发生深刻的颠覆性重构'."
                },
                {
                    "section": "listening",
                    "question_number": 3,
                    "question_type": "multiple_choice",
                    "audio_text": "面对严峻的就业竞争压力，大学生应当尽早明确职业规划，在大学期间有针对性地充实自身专业技能储备。",
                    "stimulus": "Lời khuyên hướng nghiệp cho sinh viên.",
                    "question_text": "Chuyên gia khuyên sinh viên đại học nên hành động ra sao?",
                    "options": ["A. 尽早明确职业规划并充实技能储备", "B. 毕业后再开始寻找实习机会", "C. 盲目跟风考取各类证书", "D. 降低就业薪资期望值"],
                    "correct_answer": "A. 尽早明确职业规划并充实技能储备",
                    "explanation_vi": "Chuyên gia khuyên: '尽早明确职业规划，在大学期间有针对性地充实自身专业技能储备'."
                },
                {
                    "section": "reading",
                    "question_number": 4,
                    "question_type": "multiple_choice",
                    "stimulus": "在激烈的商业竞争中，企业只有具备________的市场洞察力，才能抢占先机。",
                    "question_text": "Chọn tính từ phù hợp đi cùng '市场洞察力':",
                    "options": ["A. 敏锐", "B. 粗糙", "C. 顽固", "D. 迟钝"],
                    "correct_answer": "A. 敏锐",
                    "explanation_vi": "'敏锐的洞察力' là cụm cố định chuẩn mực (khả năng quan sát nhạy bén sắc sảo)."
                },
                {
                    "section": "reading",
                    "question_number": 5,
                    "question_type": "multiple_choice",
                    "stimulus": "科学技术不仅极大拓宽了人类认识世界的途径，________推动了社会生产力的质的跃升。",
                    "question_text": "Điền liên từ tăng tiến thích hợp sau 不仅:",
                    "options": ["A. 从而", "B. 尽管", "C. 既然", "D. 反倒"],
                    "correct_answer": "A. 从而",
                    "explanation_vi": "'不仅...，从而...' dẫn đến kết quả nhảy vọt về chất của sức sản xuất."
                },
                {
                    "section": "reading",
                    "question_number": 6,
                    "question_type": "multiple_choice",
                    "stimulus": "面对百年未有之大变局，我们既要从________层面把握时代趋势，又要从微观层面抓实各项举措。",
                    "question_text": "Chọn từ đối xứng với '微观' (vi mô):",
                    "options": ["A. 宏观", "B. 悲观", "C. 乐观", "D. 壮观"],
                    "correct_answer": "A. 宏观",
                    "explanation_vi": "Cặp từ đối xứng triết học kinh điển: '宏观' (vĩ mô) đối với '微观' (vi mô)."
                },
                {
                    "section": "reading",
                    "question_number": 7,
                    "question_type": "multiple_choice",
                    "stimulus": "建立长效机制旨在彻底根除困扰基层多年的形式主义________。",
                    "question_text": "Chọn danh từ tiêu cực chỉ vấn nạn thâm căn cố đế:",
                    "options": ["A. 弊端", "B. 优势", "C. 效益", "D. 潜能"],
                    "correct_answer": "A. 弊端",
                    "explanation_vi": "'根除弊端' (nhổ bỏ tận gốc các bất cập, tệ nạn) là kết hợp chuẩn mực."
                },
                {
                    "section": "reading",
                    "question_number": 8,
                    "question_type": "multiple_choice",
                    "stimulus": "________遇到多大的艰难险阻，全体建设者也毫不退缩，保质保量如期完成了世纪大桥的贯通。",
                    "question_text": "Điền liên từ nhượng bộ cực hạn đi với 也:",
                    "options": ["A. 哪怕", "B. 既然", "C. 因而", "D. 鉴于"],
                    "correct_answer": "A. 哪怕",
                    "explanation_vi": "Cấu trúc: '哪怕...也...' (Cho dù... cũng quyết không lùi bước)."
                },
                {
                    "section": "reading",
                    "question_number": 9,
                    "question_type": "multiple_choice",
                    "stimulus": "文学大师的经典作品历经岁月洗礼，愈发显现出其思想的深邃与精神的________。",
                    "question_text": "Chọn danh từ/tính từ chỉ sự vững chãi dồi dào nội lực:",
                    "options": ["A. 充实", "B. 浮躁", "C. 勉强", "D. 恶劣"],
                    "correct_answer": "A. 充实",
                    "explanation_vi": "'精神的充实' (sự dồi dào, phong phú vững chãi về tinh thần)."
                },
                {
                    "section": "reading",
                    "question_number": 10,
                    "question_type": "multiple_choice",
                    "stimulus": "与其在盲目跟风中迷失自我，________静下心来深耕自身核心竞争优势。",
                    "question_text": "Điền vế lựa chọn ưu tiên sau 与其:",
                    "options": ["A. 不如", "B. 从而", "C. 除非", "D. 哪怕"],
                    "correct_answer": "A. 不如",
                    "explanation_vi": "Cặp liên từ lựa chọn dứt khoát: '与其...不如...' (Thà... còn hơn...)."
                }
            ]
        },

        # ================= HSK 5 EXAM 2 =================
        {
            "hsk_level": 5,
            "title": "Đề Thi Mô Phỏng Chuẩn HSK 5 (Mock Test #02)",
            "description": "Bộ đề thi khảo sát năng lực đọc báo chí chuyên ngành, văn phong lập luận kinh tế và quản trị doanh nghiệp.",
            "duration_minutes": 120,
            "total_score": 300,
            "questions": [
                {
                    "section": "listening",
                    "question_number": 1,
                    "question_type": "multiple_choice",
                    "audio_text": "鉴于原材料价格持续上涨导致制造成本大幅攀升，董事会经慎重考虑，决定适度上调部分高档产品的出厂价格。",
                    "stimulus": "Thông cáo báo chí của hội đồng quản trị.",
                    "question_text": "Vì sao công ty quyết định tăng giá xuất xưởng một số dòng sản phẩm cao cấp?",
                    "options": ["A. 原材料价格持续上涨导致成本攀升", "B. 市场供不应求故意抬高物价", "C. 公司面临倒闭破产危机", "D. 受到竞争对手恶意收购"],
                    "correct_answer": "A. 原材料价格持续上涨导致成本攀升",
                    "explanation_vi": "Nêu rõ nguyên nhân: '鉴于原材料价格持续上涨导致制造成本大幅攀升'."
                },
                {
                    "section": "listening",
                    "question_number": 2,
                    "question_type": "multiple_choice",
                    "audio_text": "在团队管理过程中，单向的批评施压往往适得其反，建立健全双向沟通渠道与正向激励机制才能真正凝聚人心。",
                    "stimulus": "Tọa đàm về nghệ thuật lãnh đạo nhân sự.",
                    "question_text": "Phương thức nào mới thực sự có thể gắn kết và thu phục lòng người trong đội ngũ?",
                    "options": ["A. 建立双向沟通与正向激励机制", "B. 采取单向批评与严苛施压", "C. 辞退所有提出不同意见的员工", "D. 实行封闭式军事化管理"],
                    "correct_answer": "A. 建立双向沟通与正向激励机制",
                    "explanation_vi": "Khẳng định: '建立健全双向沟通渠道与正向激励机制才能真正凝聚人心'."
                },
                {
                    "section": "listening",
                    "question_number": 3,
                    "question_type": "multiple_choice",
                    "audio_text": "优秀的科学研究往往源于对日常现象的好奇与执着追问，正是这种看似微小的灵感启发，最终引领了重大的理论突破。",
                    "stimulus": "Diễn thuyết truyền cảm hứng khoa học.",
                    "question_text": "Những đột phá khoa học trọng đại thường bắt nguồn từ đâu?",
                    "options": ["A. 源于对日常现象的好奇与执着追问", "B. 源于单纯追求巨额商业回报", "C. 完全凭借偶然的好运气", "D. 照搬国外现成的理论模型"],
                    "correct_answer": "A. 源于对日常现象的好奇与执着追问",
                    "explanation_vi": "Nêu rõ: '源于对日常现象的好奇与执着追问...引领了重大的理论突破'."
                },
                {
                    "section": "reading",
                    "question_number": 4,
                    "question_type": "multiple_choice",
                    "stimulus": "绿色低碳转型并非意味着放弃经济增长，而是通过技术创新实现发展模式的彻底________。",
                    "question_text": "Chọn danh từ mang tính chuyển biến căn bản:",
                    "options": ["A. 蜕变", "B. 犹豫", "C. 耽误", "D. 罕见"],
                    "correct_answer": "A. 蜕变",
                    "explanation_vi": "'彻底蜕变' (chuyển biến lột xác hoàn toàn) thể hiện sự nâng cấp chất lượng mô hình."
                },
                {
                    "section": "reading",
                    "question_number": 5,
                    "question_type": "multiple_choice",
                    "stimulus": "重大战略决策必须保持冷静理性，经过缜密论证，绝不可操之过急、盲目________。",
                    "question_text": "Chọn động từ/tính từ chỉ sự hấp tấp:",
                    "options": ["A. 冒进", "B. 稳健", "C. 谨慎", "D. 充实"],
                    "correct_answer": "A. 冒进",
                    "explanation_vi": "'盲目冒进' (mù quáng tiến bừa) tương phản với bình tĩnh cẩn trọng."
                },
                {
                    "section": "reading",
                    "question_number": 6,
                    "question_type": "multiple_choice",
                    "stimulus": "这支新药研发团队经过长达七年的不懈探索，终于攻克了核心靶点技术________。",
                    "question_text": "Chọn danh từ chỉ rào cản thách thức công nghệ:",
                    "options": ["A. 难关", "B. 效益", "C. 理念", "D. 途径"],
                    "correct_answer": "A. 难关",
                    "explanation_vi": "'攻克难关' (công phá ải khó, vượt qua nút thắt rào cản) là kết hợp cố định."
                },
                {
                    "section": "reading",
                    "question_number": 7,
                    "question_type": "multiple_choice",
                    "stimulus": "对外经济贸易合作应当遵循相互尊重、平等互利的原则，努力实现互利________。",
                    "question_text": "Chọn thành ngữ/từ chỉ đôi bên cùng thắng lợi:",
                    "options": ["A. 共赢", "B. 独占", "C. 垄断", "D. 妥协"],
                    "correct_answer": "A. 共赢",
                    "explanation_vi": "'互利共赢' (cùng có lợi, đôi bên cùng thắng) là tôn chỉ ngoại giao kinh tế."
                },
                {
                    "section": "reading",
                    "question_number": 8,
                    "question_type": "multiple_choice",
                    "stimulus": "在突发公共事件面前，政府部门及时发布权威信息，能够有效________公众恐慌心理。",
                    "question_text": "Chọn động từ chỉ sự làm dịu đi cảm xúc:",
                    "options": ["A. 安抚", "B. 激化", "C. 挑拨", "D. 恶化"],
                    "correct_answer": "A. 安抚",
                    "explanation_vi": "'安抚公众恐慌心理' (xoa dịu tâm lý hoang mang của công chúng)."
                },
                {
                    "section": "reading",
                    "question_number": 9,
                    "question_type": "multiple_choice",
                    "stimulus": "一个具备高度社会责任感的企业，绝不会为了牟取短期暴利而________法律红线。",
                    "question_text": "Chọn động từ chỉ hành vi vi phạm ranh giới:",
                    "options": ["A. 践踏", "B. 恪守", "C. 捍卫", "D. 遵循"],
                    "correct_answer": "A. 践踏",
                    "explanation_vi": "'践踏法律红线' (chà đạp lên lằn ranh đỏ của pháp luật)."
                },
                {
                    "section": "reading",
                    "question_number": 10,
                    "question_type": "multiple_choice",
                    "stimulus": "我们要善于从前人积累的丰富智慧中汲取滋养，为当下的现代化建设提供深刻________。",
                    "question_text": "Chọn danh từ chỉ sự gợi mở trí tuệ:",
                    "options": ["A. 启示", "B. 拖延", "C. 阻碍", "D. 浪费"],
                    "correct_answer": "A. 启示",
                    "explanation_vi": "'提供深刻启示' (mang lại những gợi mở khai sáng sâu sắc)."
                }
            ]
        },

        # ================= HSK 6 EXAM 1 =================
        {
            "hsk_level": 6,
            "title": "Đề Thi Mô Phỏng Đỉnh Cao HSK 6 (Mock Test #01)",
            "description": "Đề thi cấp độ tinh hoa HSK 6: Thành ngữ 4 chữ, thấu thị triết lý nhân sinh, văn phong học thuật uyên bác.",
            "duration_minutes": 135,
            "total_score": 300,
            "questions": [
                {
                    "section": "reading",
                    "question_number": 1,
                    "question_type": "multiple_choice",
                    "stimulus": "智者往往懂得在风平浪静之时便________，以防突如其来的变故。",
                    "question_text": "Chọn thành ngữ 4 chữ biểu đạt sự lo liệu phòng xa chu đáo:",
                    "options": ["A. 未雨绸缪", "B. 拔苗助长", "C. 守株待兔", "D. 掩耳盗铃"],
                    "correct_answer": "A. 未雨绸缪",
                    "explanation_vi": "'未雨绸缪' nghĩa là trời chưa mưa đã lo sửa sang cửa nhà, biểu thị sự lo xa chu đáo trước khi rủi ro ập đến."
                },
                {
                    "section": "reading",
                    "question_number": 2,
                    "question_type": "multiple_choice",
                    "stimulus": "家庭良好家风的言传身教，对年幼孩子的道德品质形成起到了________的作用。",
                    "question_text": "Chọn thành ngữ biểu đạt sự tác động thầm lặng sâu sắc theo thời gian:",
                    "options": ["A. 潜移默化", "B. 突飞猛进", "C. 纸上谈兵", "D. 沧海一粟"],
                    "correct_answer": "A. 潜移默化",
                    "explanation_vi": "'潜移默化' nghĩa là mưa dầm thấm lâu, tính cách và tư tưởng được uốn nắn một cách tự nhiên và bền bỉ."
                },
                {
                    "section": "reading",
                    "question_number": 3,
                    "question_type": "multiple_choice",
                    "stimulus": "学习深奥精妙的古代典籍必须________，打牢基础，绝不能妄想一蹴而就。",
                    "question_text": "Chọn thành ngữ biểu đạt sự tiến hành tuần tự từng bước:",
                    "options": ["A. 循序渐进", "B. 急功近利", "C. 墨守成规", "D. 望梅止渴"],
                    "correct_answer": "A. 循序渐进",
                    "explanation_vi": "'循序渐进' là theo đúng trình tự từ dễ đến khó, từng bước tiến lên."
                },
                {
                    "section": "reading",
                    "question_number": 4,
                    "question_type": "multiple_choice",
                    "stimulus": "长达数年的实地田野调查为这项重大社会学课题研究积累了极其________的第一手翔实资料。",
                    "question_text": "Chọn tính từ cao cấp chỉ sự phong phú, dồi dào, thâm sâu:",
                    "options": ["A. 扎实", "B. 浮躁", "C. 苍白", "D. 虚幻"],
                    "correct_answer": "A. 扎实",
                    "explanation_vi": "'扎实的资料/基础' biểu thị nguồn tài liệu vô cùng vững chắc và đáng tin cậy."
                },
                {
                    "section": "reading",
                    "question_number": 5,
                    "question_type": "multiple_choice",
                    "stimulus": "在历史的长河中，个人的得失荣辱若放置于沧桑岁月的宏阔尺度下，往往不过是________。",
                    "question_text": "Chọn thành ngữ biểu thị sự nhỏ bé như hạt cát giữa sa mạc:",
                    "options": ["A. 沧海一粟", "B. 举足轻重", "C. 首屈一指", "D. 气势磅礴"],
                    "correct_answer": "A. 沧海一粟",
                    "explanation_vi": "'沧海一粟' nghĩa là một hạt kê nhỏ giữa biển Đông bao la, ví với sự nhỏ bé hữu hạn của cá nhân trước vũ trụ."
                },
                {
                    "section": "reading",
                    "question_number": 6,
                    "question_type": "multiple_choice",
                    "stimulus": "一位具有深厚学养的文学批评家，应当善于________，从平凡细微之处发掘作品的精神意蕴。",
                    "question_text": "Chọn thành ngữ chỉ năng lực nhìn thấy manh nha nhỏ biết được đại cuộc:",
                    "options": ["A. 见微知著", "B. 掩耳盗铃", "C. 画蛇添足", "D. 拔苗助长"],
                    "correct_answer": "A. 见微知著",
                    "explanation_vi": "'见微知著' là nhìn thấy dấu hiệu mầm mống nhỏ nhoi mà thấu triệt được xu thế lớn."
                },
                {
                    "section": "reading",
                    "question_number": 7,
                    "question_type": "multiple_choice",
                    "stimulus": "老一辈科学家隐姓埋名数十年，为了祖国的国防尖端科技事业真正做到了________。",
                    "question_text": "Chọn thành ngữ chỉ đức hy sinh cúc cung tận tụy đến hơi thở cuối cùng:",
                    "options": ["A. 鞠躬尽瘁", "B. 侃侃而谈", "C. 别出心裁", "D. 望尘莫及"],
                    "correct_answer": "A. 鞠躬尽瘁",
                    "explanation_vi": "'鞠躬尽瘁，死而后已' chỉ tinh thần cống hiến hết lòng hết sức vì đại nghiệp đến trọn đời."
                },
                {
                    "section": "reading",
                    "question_number": 8,
                    "question_type": "multiple_choice",
                    "stimulus": "他的学术研究不盲从既有结论，敢于打破常规、________，开辟了全新的理论维度。",
                    "question_text": "Chọn thành ngữ chỉ tinh thần sáng tạo độc đáo vượt bậc:",
                    "options": ["A. 标新立异", "B. 墨守成规", "C. 循规蹈矩", "D. 滥竽充数"],
                    "correct_answer": "A. 标新立异",
                    "explanation_vi": "'标新立异' nghĩa là sáng tạo dựng nên cái mới độc đáo chưa từng có."
                },
                {
                    "section": "reading",
                    "question_number": 9,
                    "question_type": "multiple_choice",
                    "stimulus": "大自然以其________的气魄与鬼斧神工的造化，令每一位跋涉至此的旅人叹为观止。",
                    "question_text": "Chọn tính từ miêu tả khí thế hùng vĩ cuồn cuộn ngút trời:",
                    "options": ["A. 磅礴", "B. 萧条", "C. 琐碎", "D. 狭隘"],
                    "correct_answer": "A. 磅礴",
                    "explanation_vi": "'气势磅礴' (khí thế bàng bạc hùng vĩ ngút trời) là từ ngữ đỉnh cao của văn học miêu tả thiên nhiên."
                },
                {
                    "section": "reading",
                    "question_number": 10,
                    "question_type": "multiple_choice",
                    "stimulus": "中华文明之所以生生不息、历久弥新，关键在于其拥有海纳百川、________的博大胸襟。",
                    "question_text": "Chọn thành ngữ chỉ sự bao dung thu nhận mọi tinh hoa tư tưởng:",
                    "options": ["A. 兼容并蓄", "B. 一筹莫展", "C. 纸上谈兵", "D. 闭关锁国"],
                    "correct_answer": "A. 兼容并蓄",
                    "explanation_vi": "'兼容并蓄' (bao dung dung hòa tinh hoa đa nguyên) là đặc trưng cốt lõi của văn minh Trung Hoa."
                }
            ]
        },

        # ================= HSK 6 EXAM 2 =================
        {
            "hsk_level": 6,
            "title": "Đề Thi Mô Phỏng Đỉnh Cao HSK 6 (Mock Test #02)",
            "description": "Thử thách phát hiện câu sai ngữ pháp (病句), thẩm âm thành ngữ và tư duy biện luận văn bản cổ kim.",
            "duration_minutes": 135,
            "total_score": 300,
            "questions": [
                {
                    "section": "reading",
                    "question_number": 1,
                    "question_type": "multiple_choice",
                    "stimulus": "请仔细辨析下列四个句子，选出没有语病（完全正确）的一句：",
                    "question_text": "Chọn câu văn có ngữ pháp chuẩn xác và mạch lạc nhất:",
                    "options": [
                        "A. 经过充分的论证与多轮推演，专家组最终确定了这一套切实可行的方案。",
                        "B. 能否养成良好的阅读习惯，是决定一个人能否终身受益的关键因素之一。",
                        "C. 他不仅在学术上取得了卓越的成就，而且平易近人、乐于提携后进青年学者。",
                        "D. 以上三句均完全符合现代汉语高级语法规范。"
                    ],
                    "correct_answer": "D. 以上三句均完全符合现代汉语高级语法规范。",
                    "explanation_vi": "Cả ba câu A, B, C đều có cấu trúc ngữ pháp chuẩn mực: A đầy đủ trạng - chủ - vị; B cấu trúc hai mặt '能否...能否' cân xứng hoàn hảo; C liên từ tăng tiến '不仅...而且' hợp lý."
                },
                {
                    "section": "reading",
                    "question_number": 2,
                    "question_type": "multiple_choice",
                    "stimulus": "面对科研攻关中的重重技术壁垒，团队以破釜沉舟的决绝勇气，________，最终摘取了桂冠。",
                    "question_text": "Chọn thành ngữ chỉ sự kiên trì miệt mài gọt giũa không nản lòng:",
                    "options": ["A. 锲而不舍", "B. 浅尝辄止", "C. 半途而废", "D. 见异思迁"],
                    "correct_answer": "A. 锲而不舍",
                    "explanation_vi": "'锲而不舍' nghĩa là khắc đẽo mài giũa không dừng, chỉ lòng kiên trì bất khuất trước mọi khó khăn."
                },
                {
                    "section": "reading",
                    "question_number": 3,
                    "question_type": "multiple_choice",
                    "stimulus": "历史发展的客观规律表明，凡是逆时代潮流而动、固步自封者，最终难免陷入________的窘境。",
                    "question_text": "Chọn thành ngữ chỉ sự bó tay hết cách, không xoay xở nổi mưu kế:",
                    "options": ["A. 一筹莫展", "B. 游刃有余", "C. 势如破竹", "D. 得心应手"],
                    "correct_answer": "A. 一筹莫展",
                    "explanation_vi": "'一筹莫展' nghĩa là một kế cũng không đưa ra nổi, hoàn toàn rơi vào cảnh bế tắc bó tay."
                },
                {
                    "section": "reading",
                    "question_number": 4,
                    "question_type": "multiple_choice",
                    "stimulus": "这位老工匠一生专注于传统漆器的制作，他的手艺登峰造极，在业内堪称________。",
                    "question_text": "Chọn thành ngữ chỉ vị thế dẫn đầu tuyệt đối:",
                    "options": ["A. 首屈一指", "B. 平淡无奇", "C. 略胜一筹", "D. 无足轻重"],
                    "correct_answer": "A. 首屈一指",
                    "explanation_vi": "'首屈一指' là ngón tay cái giơ lên đầu tiên, tượng trưng cho vị trí số 1 xuất sắc nhất."
                },
                {
                    "section": "reading",
                    "question_number": 5,
                    "question_type": "multiple_choice",
                    "stimulus": "在长期的文化交融互鉴历程中，各民族优秀的民间艺术相互汲取滋养，呈现出百花齐放、________的生动景象。",
                    "question_text": "Chọn thành ngữ mang ý nghĩa phồn vinh rực rỡ cùng đua nhau khoe sắc:",
                    "options": ["A. 繁花似锦", "B. 门可罗雀", "C. 万籁俱寂", "D. 孤芳自赏"],
                    "correct_answer": "A. 繁花似锦",
                    "explanation_vi": "'繁花似锦' (hoa nở như gấm dệt rực rỡ) miêu tả cảnh tượng văn hóa nghệ thuật trăm hoa đua nở phồn thịnh."
                },
                {
                    "section": "reading",
                    "question_number": 6,
                    "question_type": "multiple_choice",
                    "stimulus": "面对来势汹汹的突发危机，如果只懂得生搬硬套书本教条，而不懂得________，往往会造成无可挽回的损失。",
                    "question_text": "Chọn thành ngữ chỉ khả năng tùy cơ ứng biến linh hoạt:",
                    "options": ["A. 随机应变", "B. 胶柱鼓瑟", "C. 刻舟求剑", "D. 削足适履"],
                    "correct_answer": "A. 随机应变",
                    "explanation_vi": "'随机应变' (tùy cơ ứng biến) đối lập trực tiếp với việc rập khuôn máy móc giáo điều."
                },
                {
                    "section": "reading",
                    "question_number": 7,
                    "question_type": "multiple_choice",
                    "stimulus": "古典诗词中那些历经千百年依旧在民间广为传唱的名篇佳句，无不因其真挚感人而成为________之作。",
                    "question_text": "Chọn thành ngữ chỉ tác phẩm hay được muôn người ngâm nga truyền tụng:",
                    "options": ["A. 脍炙人口", "B. 默默无闻", "C. 不见经传", "D. 荒诞不经"],
                    "correct_answer": "A. 脍炙人口",
                    "explanation_vi": "'脍炙人口' là món thịt nướng ngon miệng ai cũng thích ăn, ví với áng thơ văn hay ai ai cũng truyền tụng."
                },
                {
                    "section": "reading",
                    "question_number": 8,
                    "question_type": "multiple_choice",
                    "stimulus": "真正的大学问家往往虚怀若谷，即使取得了举世公认的卓绝学术成果，也从不________。",
                    "question_text": "Chọn thành ngữ chỉ thái độ tự cao tự đại huênh hoang:",
                    "options": ["A. 居功自傲", "B. 虚心求教", "C. 闻鸡起舞", "D. 韬光养晦"],
                    "correct_answer": "A. 居功自傲",
                    "explanation_vi": "'居功自傲' nghĩa là cậy có công lao mà kiêu căng tự đắc."
                },
                {
                    "section": "reading",
                    "question_number": 9,
                    "question_type": "multiple_choice",
                    "stimulus": "这幅珍贵的传世古代水墨画卷笔法精妙传神，把江南水乡的烟雨迷蒙描摹得淋漓尽致，令人________。",
                    "question_text": "Chọn thành ngữ biểu đạt sự thán phục tột đỉnh không tiếc lời:",
                    "options": ["A. 叹为观止", "B. 无动于衷", "C. 嗤之以鼻", "D. 视而不见"],
                    "correct_answer": "A. 叹为观止",
                    "explanation_vi": "'叹为观止' là khen ngợi tán thán nghệ thuật đã đạt tới đỉnh cao tuyệt mỹ không gì hơn được nữa."
                },
                {
                    "section": "reading",
                    "question_number": 10,
                    "question_type": "multiple_choice",
                    "stimulus": "做人处事当懂得感恩戴德，无论日后身居何等显赫之位，都决不可忘却曾经提携帮助过自己的师长与故土，务必懂得________。",
                    "question_text": "Chọn thành ngữ chỉ đạo lý biết ơn nguồn cội:",
                    "options": ["A. 饮水思源", "B. 过河拆桥", "C. 忘恩负义", "D. 恩将仇报"],
                    "correct_answer": "A. 饮水思源",
                    "explanation_vi": "'饮水思源' nghĩa là uống nước nhớ nguồn, giữ trọn đạo lý ân nghĩa ngàn đời."
                }
            ]
        }
    ]
    return exams

if __name__ == "__main__":
    exams = build_exam_data()
    print(f"Total Exams: {len(exams)}")
    for e in exams:
        print(f"Level {e['hsk_level']}: {e['title']} -> {len(e['questions'])} questions")

    with open("/home/admin1/hskde/backend/app/data/exam_data.py", "w", encoding="utf-8") as f:
        f.write("# Complete Authentic HSK 1 - 6 Mock Exam Dataset (12 exams, 10 questions each = 120 questions)\n")
        f.write("EXAM_DATA = ")
        f.write(pprint.pformat(exams, indent=4, width=120, compact=False))
        f.write("\n")
    print("Written /home/admin1/hskde/backend/app/data/exam_data.py successfully!")
