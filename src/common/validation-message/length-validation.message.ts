import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  /**
   * ValidationiAgrument 의 프롯퍼티들
   * 1. value -> 검증 되고 있는 값(입려된 값)
   * 2. constraints -> 파라미터에 입련된 제한 사항들 @Length 어노테이션의 경우에는 2,20
   *  args.constraints[0] -> 2
   *  args.constraints[1] -> 20
   * 3. targetName -> 검증되고 있는 객체의 이름 -> UserModel
   * 4. object -> 검증되고 있는 객체 -> { name: '홍길동' }
   * 5. property -> 검증되고 있는 객체의 프로퍼티 이름 -> name
   */
  if (args.constraints.length === 2) {
    return `${args.property}은(는) ${args.constraints[0]}자 이상 ${args.constraints[1]}자 이하로 입력해주세요.`;
  } else {
    return `${args.property}은(는) ${args.constraints[0]}자 이상 입력해주세요.`;
  }
};
