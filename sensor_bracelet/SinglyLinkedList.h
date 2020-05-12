#ifndef SINGLYLINKEDLIST_H
#define SINGLYLINKEDLIST_H

class Node;

class SinglyLinkedList {
    public:
        int maxLength;
        int length = 0;
        float totalValue = 0;
        Node* head;
        Node* tail;

        //Creates a SinglyLinkedList of a length
        SinglyLinkedList(int length);

        // adds a float value to the list
        void add(float value);

        //Returns the average of all items in the list
        float average(); 

        //Returns a boolean to represent if the list is full
        bool full();       
};

class Node {
    public:
        Node* tail;
        float value;
        
        Node(float value);

        void addToTail(Node* node);
}; 


#endif
