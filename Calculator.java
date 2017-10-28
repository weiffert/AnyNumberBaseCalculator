/*
* Any Number Base Calculator
*
* This is designed to calculate basic operations of a number in any base.
* It converts the numbers to base 10, performs the operation, then converts them back.
*
* @author William Eiffert
*
* @version September 29, 2017
*/

import java.util.Scanner;

public class Calculator {
    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter in a base: ");
        int base = scanner.nextInt();
        scanner.nextLine();

        System.out.print("Enter in the operation: ");
        char operation = scanner.nextLine().charAt(0);

        System.out.print("Enter in the numbers to perform the operation:\n");
        String num1String = scanner.nextLine();
        String num2String = scanner.nextLine();

        int num1BaseTen = toBaseTen(num1String, base);
        int num2BaseTen = toBaseTen(num2String, base);
        int resultBaseTen = 0;

        switch(operation) {
            case '+':
                resultBaseTen = num1BaseTen + num2BaseTen;
                break;
            case '-':
                resultBaseTen = num1BaseTen - num2BaseTen;
                break;
            case '*':
                resultBaseTen = num1BaseTen * num2BaseTen;
                break;
            case '/':
                resultBaseTen = num1BaseTen / num2BaseTen;
                break;
            case '%':
                resultBaseTen = num1BaseTen % num2BaseTen;
                break;
            default:
                System.out.println("Invalid operation input!");
        }

        int result = backToBase(resultBaseTen, base);
        System.out.println(result);
    }

    static int toBaseTen(String numString, int base) {
        int[] num1Arr = new int[numString.length()];
        boolean num1Negative = false;

        for(int i = numString.length() - 1, index = 0; i >= 0; i--, index++) {
            if(Character.isDigit(numString.charAt(i)))
                num1Arr[index] = Integer.parseInt(numString.substring(i, i+1));
            else if(Character.isAlphabetic(numString.charAt(i))) {
                char c = Character.toUpperCase(numString.charAt(i));
                num1Arr[index] = c - 55;
            }
            else if(numString.charAt(i) == '-')
                num1Negative = true;
            else
                System.out.println("Invalid Character. Passing over...");
        }

        int numBaseTen = 0;

        int placeValue = 1;
        for(int element : num1Arr) {
            numBaseTen += element * placeValue;
            placeValue *= base;
        }

        if(num1Negative)
            numBaseTen *= -1;

        return numBaseTen;
    }

    static int backToBase(int result, int base) {
        boolean resultNegative = false;

        if(result < 0) {
            result *= -1;
            resultNegative = true;
        }

        String resultBaseString = "";
        while(result >= 1) {
            if(result % base < 10)
                resultBaseString = result % base + resultBaseString;
            else
                resultBaseString = Character.toChars(result % base + 55)[0] + resultBaseString;
            result /= base;
        }

        if(resultNegative)
            resultBaseString = "-" + resultBaseString;

        return Integer.parseInt(resultBaseString);
    }

}
