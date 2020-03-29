#ifndef SINGLELINKEDLIST_H
#define SINGLELINKEDLIST_H

class Node;

class SingleLinkedList {
    public:
        int maxLength;
        int length = 0;
        float totalValue = 0;
        Node* head;
        Node* tail;

        SingleLinkedList(int length);

        void add(float value);

        float average(); 

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
