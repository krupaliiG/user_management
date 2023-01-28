import generator from "generate-password";

const randompasswords = generator.generateMultiple(1, {
  length: 10,
  uppercase: false,
});

export default randompasswords;
