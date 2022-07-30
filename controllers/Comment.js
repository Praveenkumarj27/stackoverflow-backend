import Questions from "../models/Questions.js";
import mongoose from "mongoose";



export const addComment = async (req, res) => {
  const { questionID, comment, commenter } = req.body; // comment, questionId, userID
  const questionData = await Questions.findById(questionID);
  questionData.comments = [
    ...questionData.comments,
    { comment: comment, commentQuestionId: questionID, commenter },
  ]; 
  questionData.save();
  console.log("comment added");
};

// export const getAllQuestions = async (req, res) => {
//   try {
//     const questionList = await Questions.find();
//     res.status(200).json(questionList);
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

export const deleteComment = async (req, res) => {
  const { questionId, questionCommentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    const reqQuestion = await Questions.findById(questionId);
    // console.log(reqQuestion.comments);
    // console.log("questionCommentID", questionCommentId);
    const deletedCommentArray = await reqQuestion.comments.filter((comment) => {
      console.log(comment._id, questionCommentId);
      return comment._id != questionCommentId;
    });
    // const reqComment = await reqQuestion.comments.find({
    // console.log(mongoose.Types.ObjectId(questionCommentId));
    console.log(deletedCommentArray);
    //   _id: mongoose.Types.ObjectId(questionCommentId),s
    // });
    console.log("going to print req comment");
    // console.log(reqComment);
    reqQuestion.comments = [...deletedCommentArray];
    reqQuestion.save();
    console.log("delete request made");
    res.status(200).json({ message: "successfully deleted..." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const editComment = async (req, res) => {
  const { questionId, questionCommentId } = req.params;
  const value = req.body.editedComment;
  console.log("request.body is", req.body);
  console.log("value is", value);
  // const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    const reqQuestion = await Questions.findById(questionId);
    const editedCommentArray = reqQuestion.comments.map((comment) => {
      if (comment._id == questionCommentId) {
        comment.comment = value;
      }
      return comment;
    });

    // console.log(editedCommentArray);

    reqQuestion.comments = [...editedCommentArray];

    await reqQuestion.save();
    console.log("edit request made");
    res.status(200).json({ message: "edited successfully..." });
  } catch (error) {
    res.status(404).json({ message: "id not found" });
  }
};
